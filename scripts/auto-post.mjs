import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd());
const postsPath = path.join(root, "data", "posts.json");
const sitemapPath = path.join(root, "sitemap.xml");
const blogRoot = path.join(root, "blog");
const siteUrl = (process.env.SITE_URL || "https://priya4042.github.io/wellness-bloom-women-health-blog").replace(/\/$/, "");

const categories = [
  { slug: "hair-growth", label: "Hair Growth" },
  { slug: "thyroid", label: "Thyroid" },
  { slug: "period-health", label: "Period Health" },
  { slug: "digestion", label: "Digestion" },
  { slug: "fat-loss", label: "Fat Loss" }
];

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function countWords(html) {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

function buildDailyContent(categoryLabel, dateLabel) {
  const paragraphs = [
    `<p>This daily ${categoryLabel.toLowerCase()} briefing for ${dateLabel} is designed to give women a practical health plan they can apply immediately. Instead of abstract advice, the focus is small actions that stack across the week and improve consistency. The most reliable progress comes from repeatable habits, not dramatic one-day efforts.</p>`,
    `<h2>Start With a Stable Morning</h2><p>Begin with hydration, a protein-focused breakfast, and ten minutes of low-stress movement. This pattern supports appetite regulation, energy stability, and decision quality throughout the day. Morning structure is especially helpful when hormonal symptoms fluctuate or schedule demands increase.</p>`,
    `<p>Keep this routine simple enough to repeat during busy days. If your mornings are unpredictable, prepare one default breakfast and one backup option the night before. Reducing friction increases adherence and protects progress during high-stress periods.</p>`,
    `<h2>Build Meals Around Recovery and Satiety</h2><p>Choose meals with protein, produce, fiber, and healthy fats. This combination improves fullness, supports digestion, and helps reduce evening cravings. Use meal templates rather than chasing perfect recipes, and focus on weekly consistency over single-meal perfection.</p>`,
    `<ul><li>Anchor each meal with a clear protein source.</li><li>Add color from vegetables or fruit for micronutrients.</li><li>Adjust carbohydrates around activity and energy needs.</li><li>Hydrate evenly through the day.</li></ul>`,
    `<p>If digestion feels sensitive, increase fiber gradually and track response. If energy drops, review sleep and stress before cutting calories further. Your body gives useful feedback when you listen consistently and document patterns.</p>`,
    `<h2>Use Movement as a Daily Regulator</h2><p>Movement does not need to be extreme to be effective. Walking, mobility, and strength sessions at appropriate intensity can improve metabolic flexibility and mood while reducing symptom sensitivity. Choose a weekly schedule that fits recovery capacity and current life demands.</p>`,
    `<p>When stress is high, lower intensity and protect sleep. This protects endocrine stability and helps maintain long-term momentum. Recovery is not passive; it is a strategic lever for better outcomes.</p>`,
    `<h2>Weekly Check-In Questions</h2><p>At the end of each week, review what improved and what still feels difficult. Ask whether your plan was realistic, whether your environment supported it, and whether one variable should be adjusted next week. Avoid changing everything at once so you can identify what actually works.</p>`,
    `<p>Track symptoms, energy, digestion, sleep quality, and adherence. Data reduces guesswork and supports better conversations with your clinician if needed. A simple log is often enough to reveal high-value changes.</p>`,
    `<h2>Clinical Boundaries Matter</h2><p>This content supports healthy routines but does not replace medical diagnosis or treatment. Persistent pain, severe fatigue, sudden hair loss, major cycle changes, or ongoing digestive distress should be evaluated by a qualified clinician.</p>`,
    `<blockquote>Consistent basics are often more powerful than complex protocols.</blockquote><p>Use this daily brief as a guide to stay grounded in fundamentals. Small actions repeated consistently are what create visible, sustainable changes in women health over time.</p>`
  ];

  let contentHtml = paragraphs.join("\n");
  let wordCount = countWords(contentHtml);
  while (wordCount < 800) {
    const addOn = "<p>To improve adherence, simplify the plan to the smallest version you can complete every day, then expand only after two stable weeks. Consistency first, complexity later is the fastest way to build resilient health habits.</p>";
    contentHtml += "\n" + addOn;
    wordCount = countWords(contentHtml);
  }

  return { contentHtml, wordCount };
}

function buildSitemap(posts) {
  const staticPaths = [
    "",
    "/blog/",
    "/about/",
    "/contact/",
    "/privacy/",
    "/categories/hair-growth/",
    "/categories/thyroid/",
    "/categories/period-health/",
    "/categories/digestion/",
    "/categories/fat-loss/"
  ];

  const postPaths = posts.map((post) => `/blog/${post.slug}/`);
  const allPaths = [...staticPaths, ...postPaths];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths
  .map((p) => `  <url><loc>${siteUrl}${p}</loc><changefreq>weekly</changefreq><priority>${p === "" ? "1.0" : "0.8"}</priority></url>`)
  .join("\n")}
</urlset>
`;
}

function buildPostPage(post) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${post.title} | Wellness Bloom</title>
  <meta name="description" content="${post.description}">
  <meta name="keywords" content="${post.keywords.join(", ")}">
  <meta property="og:title" content="${post.title} | Wellness Bloom">
  <meta property="og:description" content="${post.description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${siteUrl}/blog/${post.slug}/">
  <meta property="og:image" content="${siteUrl}/${post.image}">
  <link rel="canonical" href="${siteUrl}/blog/${post.slug}/">
  <link rel="stylesheet" href="../../assets/css/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Manrope:wght@400;500;700;800&display=swap" rel="stylesheet">
</head>
<body data-depth="2" data-slug="${post.slug}">
  <div id="site-header"></div>
  <main class="section">
    <div class="container post-layout">
      <article class="article-shell" id="article-wrap" aria-live="polite"></article>
      <aside class="sidebar">
        <div class="ad-slot">AdSense Sidebar Placeholder (300x250)</div>
        <section>
          <h2 class="section-title">Related Posts</h2>
          <div id="related-wrap" class="grid"></div>
        </section>
      </aside>
    </div>
    <section class="container section">
      <h2 class="section-title">Read More</h2>
      <div id="read-more-wrap" class="grid grid-2"></div>
    </section>
  </main>
  <div id="site-footer"></div>
  <script src="../../assets/js/site.js"></script>
  <script src="../../assets/js/data-loader.js"></script>
  <script src="../../assets/js/post.js"></script>
</body>
</html>
`;
}

async function run() {
  const raw = await fs.readFile(postsPath, "utf8");
  const posts = JSON.parse(raw);
  const today = new Date();
  const dateSlug = toIsoDate(today);

  const category = categories[today.getDate() % categories.length];
  const slug = `daily-${category.slug}-update-${dateSlug}`;
  if (posts.some((post) => post.slug === slug)) {
    console.log("Daily post already exists for today. No changes made.");
    return;
  }

  const dateLabel = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const { contentHtml, wordCount } = buildDailyContent(category.label, dateLabel);

  const newPost = {
    slug,
    title: `${category.label} Daily Health Update: ${dateLabel}`,
    description: `Daily practical ${category.label.toLowerCase()} guidance for women, including routines and symptom-aware strategies.`,
    category: category.slug,
    categoryLabel: category.label,
    image: `assets/img/categories/${category.slug}.svg`,
    keywords: ["women health", category.slug, "daily health update", "wellness routines", "healthy habits"],
    readTime: 8,
    featured: false,
    publishedAt: dateSlug,
    excerpt: `A practical ${category.label.toLowerCase()} update with realistic habits for better consistency and wellbeing.`,
    wordCount,
    contentHtml
  };

  const updated = [newPost, ...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  await fs.writeFile(postsPath, JSON.stringify(updated, null, 2) + "\n", "utf8");
  await fs.writeFile(sitemapPath, buildSitemap(updated), "utf8");

  const postDir = path.join(blogRoot, newPost.slug);
  await fs.mkdir(postDir, { recursive: true });
  await fs.writeFile(path.join(postDir, "index.html"), buildPostPage(newPost), "utf8");

  console.log(`Added new daily post: ${slug}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
