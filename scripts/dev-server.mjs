import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

const rootDir = process.cwd();
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function normalizeRequestPath(requestUrl) {
  const parsed = new url.URL(requestUrl, "http://localhost");
  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname === "/") {
    pathname = "/index.html";
  }
  return pathname;
}

function safePath(pathname) {
  const filePath = path.join(rootDir, pathname);
  const normalized = path.normalize(filePath);
  if (!normalized.startsWith(path.normalize(rootDir))) {
    return null;
  }
  return normalized;
}

async function resolveFile(pathname) {
  const directPath = safePath(pathname);
  if (!directPath) {
    return null;
  }

  try {
    const stat = await fs.stat(directPath);
    if (stat.isFile()) {
      return directPath;
    }
    if (stat.isDirectory()) {
      const indexPath = path.join(directPath, "index.html");
      await fs.access(indexPath);
      return indexPath;
    }
  } catch {
    // Continue to fallback resolution.
  }

  const folderLike = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const asIndex = safePath(`${folderLike}index.html`);
  if (!asIndex) {
    return null;
  }

  try {
    await fs.access(asIndex);
    return asIndex;
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const pathname = normalizeRequestPath(req.url || "/");
    const filePath = await resolveFile(pathname);

    if (!filePath) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    const data = await fs.readFile(filePath);

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache"
    });
    res.end(data);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500 Internal Server Error");
    console.error(error);
  }
});

server.listen(port, () => {
  console.log(`Wellness Bloom dev server running at http://localhost:${port}`);
});
