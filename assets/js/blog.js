(function () {
  var blogGrid = document.getElementById("blog-grid");
  var searchInput = document.getElementById("search-input");
  var categorySelect = document.getElementById("category-select");
  var resultText = document.getElementById("result-text");
  var currentCategory = document.body.dataset.category || "all";

  var allPosts = [];

  function cardTemplate(post) {
    var prefix = window.SiteUtils.prefix;
    return (
      '<article class="card stagger-in">' +
      '<a class="card-media" href="' + prefix + "blog/" + post.slug + '/"><img loading="lazy" src="' + postImageUrl(post) + '" alt="' + post.categoryLabel + ' article illustration"></a>' +
      '<span class="pill">' + post.categoryLabel + "</span>" +
      '<h3><a href="' + prefix + "blog/" + post.slug + '/">' + post.title + "</a></h3>" +
      "<p>" + post.excerpt + "</p>" +
      '<div class="meta"><span>' + formatDate(post.publishedAt) + "</span><span>•</span><span>" + post.readTime + " min read</span></div>" +
      "</article>"
    );
  }

  function render(posts) {
    if (!blogGrid || !resultText) {
      return;
    }

    if (!posts.length) {
      blogGrid.innerHTML = '<p class="muted">No posts matched this search. Try a broader keyword.</p>';
      resultText.textContent = "0 posts";
      return;
    }

    blogGrid.innerHTML = posts.map(cardTemplate).join("");
    resultText.textContent = posts.length + (posts.length === 1 ? " post" : " posts");
  }

  function applyFilters() {
    var searchValue = (searchInput ? searchInput.value : "").trim().toLowerCase();
    var categoryValue = categorySelect ? categorySelect.value : "all";

    var filtered = allPosts.filter(function (post) {
      var matchCategory = categoryValue === "all" || post.category === categoryValue;
      var keywordPool = [post.title, post.excerpt, post.categoryLabel, post.keywords.join(" ")].join(" ").toLowerCase();
      var matchSearch = !searchValue || keywordPool.indexOf(searchValue) !== -1;
      return matchCategory && matchSearch;
    });

    render(filtered);
  }

  if (blogGrid) {
    blogGrid.innerHTML = '<div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div>';
  }

  loadPosts()
    .then(function (posts) {
      allPosts = posts;
      if (categorySelect && currentCategory !== "all") {
        categorySelect.value = currentCategory;
      }
      applyFilters();
    })
    .catch(function () {
      if (blogGrid) {
        blogGrid.innerHTML = '<p class="muted">Unable to load posts at the moment.</p>';
      }
    });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
  if (categorySelect) {
    categorySelect.addEventListener("change", applyFilters);
  }
})();