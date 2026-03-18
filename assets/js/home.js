(function () {
  var featuredGrid = document.getElementById("featured-grid");
  var latestGrid = document.getElementById("latest-grid");
  var categoryGrid = document.getElementById("category-grid");

  function cardTemplate(post, prefix) {
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

  function renderSkeleton(target, count) {
    target.innerHTML = "";
    for (var i = 0; i < count; i += 1) {
      var sk = document.createElement("div");
      sk.className = "skeleton skeleton-card";
      target.appendChild(sk);
    }
  }

  if (featuredGrid) {
    renderSkeleton(featuredGrid, 2);
  }
  if (latestGrid) {
    renderSkeleton(latestGrid, 4);
  }

  if (categoryGrid) {
    categoryGrid.innerHTML = [
      { slug: "hair-growth", icon: "💇", text: "Hair Growth" },
      { slug: "thyroid", icon: "🦋", text: "Thyroid" },
      { slug: "period-health", icon: "🌸", text: "Period Health" },
      { slug: "digestion", icon: "🥗", text: "Digestion" },
      { slug: "fat-loss", icon: "🏃", text: "Fat Loss" }
    ]
      .map(function (item) {
        return (
          '<a class="card category-tile" href="' + window.SiteUtils.withPrefix("categories/" + item.slug + "/index.html") + '">' +
          '<img loading="lazy" src="' + window.SiteUtils.withPrefix("assets/img/categories/" + item.slug + ".svg") + '" alt="' + item.text + ' illustration">' +
          '<h3>' + item.icon + " " + item.text + "</h3>" +
          '<p>Practical, science-informed guides for real life and sustainable routines.</p>' +
          "</a>"
        );
      })
      .join("");
  }

  loadPosts()
    .then(function (posts) {
      var prefix = window.SiteUtils.prefix;
      var featured = posts.filter(function (post) {
        return post.featured;
      }).slice(0, 2);
      var latest = posts.slice(0, 6);

      if (featuredGrid) {
        featuredGrid.innerHTML = featured.map(function (post) {
          return cardTemplate(post, prefix);
        }).join("");
      }

      if (latestGrid) {
        latestGrid.innerHTML = latest.map(function (post) {
          return cardTemplate(post, prefix);
        }).join("");
      }
    })
    .catch(function () {
      if (featuredGrid) {
        featuredGrid.innerHTML = '<p class="muted">Unable to load featured posts right now.</p>';
      }
      if (latestGrid) {
        latestGrid.innerHTML = '<p class="muted">Unable to load latest posts right now.</p>';
      }
    });
})();