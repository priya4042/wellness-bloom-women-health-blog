(function () {
  var body = document.body;
  var depth = Number(body.dataset.depth || "0");
  var prefix = "../".repeat(depth);

  function withPrefix(path) {
    return prefix + path;
  }

  function pagePath() {
    return window.location.pathname.replace(/\\/g, "/");
  }

  function isActive(pathFragment) {
    return pagePath().indexOf(pathFragment) !== -1;
  }

  var headerRoot = document.getElementById("site-header");
  if (headerRoot) {
    headerRoot.innerHTML =
      '<header class="site-header">' +
      '  <div class="container nav-wrap">' +
      '    <a class="brand" href="' + withPrefix("index.html") + '">' +
      '      <span class="brand-mark">W</span><span>Wellness Bloom</span>' +
      "    </a>" +
      '    <nav class="primary-nav" aria-label="Primary">' +
      '      <a class="' + (isActive("/index.html") || pagePath().endsWith("/") ? "active" : "") + '" href="' + withPrefix("index.html") + '">Home</a>' +
      '      <a class="' + (isActive("/blog/") ? "active" : "") + '" href="' + withPrefix("blog/index.html") + '">Blog</a>' +
      '      <a class="' + (isActive("/categories/") ? "active" : "") + '" href="' + withPrefix("categories/hair-growth/index.html") + '">Categories</a>' +
      '      <a class="' + (isActive("/about/") ? "active" : "") + '" href="' + withPrefix("about/index.html") + '">About</a>' +
      '      <a class="' + (isActive("/contact/") ? "active" : "") + '" href="' + withPrefix("contact/index.html") + '">Contact</a>' +
      "    </nav>" +
      '    <button class="nav-toggle" id="nav-toggle" aria-label="Open menu">☰</button>' +
      "  </div>" +
      '  <div class="container mobile-menu" id="mobile-menu">' +
      '    <a href="' + withPrefix("index.html") + '">Home</a>' +
      '    <a href="' + withPrefix("blog/index.html") + '">Blog</a>' +
      '    <a href="' + withPrefix("categories/hair-growth/index.html") + '">Categories</a>' +
      '    <a href="' + withPrefix("about/index.html") + '">About</a>' +
      '    <a href="' + withPrefix("contact/index.html") + '">Contact</a>' +
      "  </div>" +
      "</header>";

    var navToggle = document.getElementById("nav-toggle");
    var mobileMenu = document.getElementById("mobile-menu");
    if (navToggle && mobileMenu) {
      navToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("open");
      });
    }
  }

  var footerRoot = document.getElementById("site-footer");
  if (footerRoot) {
    footerRoot.innerHTML =
      '<footer class="footer">' +
      '  <div class="container footer-grid">' +
      "    <div>" +
      '      <p class="brand"><span class="brand-mark">W</span><span>Wellness Bloom</span></p>' +
      "      <p>Evidence-informed women health guidance for everyday life.</p>" +
      "    </div>" +
      "    <div>" +
      "      <p><strong>Quick Links</strong></p>" +
      '      <p><a href="' + withPrefix("blog/index.html") + '">All Blogs</a></p>' +
      '      <p><a href="' + withPrefix("privacy/index.html") + '">Privacy Policy</a></p>' +
      '      <p><a href="' + withPrefix("contact/index.html") + '">Contact</a></p>' +
      "    </div>" +
      "    <div>" +
      "      <p><strong>Ad Space</strong></p>" +
      '      <div class="ad-slot">AdSense Footer Placeholder (728x90)</div>' +
      '      <small>© <span id="year"></span> Wellness Bloom.</small>' +
      "    </div>" +
      "  </div>" +
      "</footer>";

    var yearNode = document.getElementById("year");
    if (yearNode) {
      yearNode.textContent = String(new Date().getFullYear());
    }
  }

  window.SiteUtils = {
    depth: depth,
    prefix: prefix,
    withPrefix: withPrefix
  };
})();