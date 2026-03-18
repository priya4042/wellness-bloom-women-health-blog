import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd());

async function findHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(full)));
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

function extractLinks(html) {
  const hrefRegex = /href\s*=\s*"([^"]+)"/g;
  const srcRegex = /src\s*=\s*"([^"]+)"/g;
  const links = [];

  let match;
  while ((match = hrefRegex.exec(html))) {
    links.push(match[1]);
  }
  while ((match = srcRegex.exec(html))) {
    links.push(match[1]);
  }

  return links;
}

async function run() {
  const htmlFiles = await findHtmlFiles(root);
  const errors = [];

  for (const file of htmlFiles) {
    const html = await fs.readFile(file, "utf8");
    const links = extractLinks(html);
    const dir = path.dirname(file);

    for (const link of links) {
      if (!link || link.startsWith("http") || link.startsWith("mailto:") || link.startsWith("#") || link.startsWith("?")) {
        continue;
      }

      const cleanLink = link.split("?")[0];
      const target = path.resolve(dir, cleanLink);
      try {
        await fs.access(target);
      } catch {
        errors.push(`${path.relative(root, file)} -> missing: ${link}`);
      }
    }
  }

  if (errors.length) {
    console.error("Link validation failed:");
    for (const error of errors) {
      console.error(error);
    }
    process.exit(1);
  }

  console.log("Link validation passed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
