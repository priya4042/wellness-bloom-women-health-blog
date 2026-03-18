(function () {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get("slug") || document.body.dataset.slug;
  if (!slug) {
    var pathParts = window.location.pathname.split("/").filter(Boolean);
    var blogIndex = pathParts.indexOf("blog");
    if (blogIndex !== -1 && pathParts[blogIndex + 1] && pathParts[blogIndex + 1] !== "post") {
      slug = pathParts[blogIndex + 1];
    }
  }
  var articleWrap = document.getElementById("article-wrap");
  var relatedWrap = document.getElementById("related-wrap");
  var readMoreWrap = document.getElementById("read-more-wrap");

  if (!slug || !articleWrap) {
    if (articleWrap) {
      articleWrap.innerHTML = '<p class="muted">Post not found.</p>';
    }
    return;
  }

  articleWrap.innerHTML = '<div class="skeleton" style="height:300px"></div>';

  loadPosts()
    .then(function (posts) {
      var post = posts.find(function (item) {
        return item.slug === slug;
      });

      if (!post) {
        articleWrap.innerHTML = '<p class="muted">Post not found.</p>';
        return;
      }

      document.title = post.title + " | Wellness Bloom";

      var metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", post.description);
      }

      articleWrap.innerHTML =
        '<figure class="article-hero-image"><img loading="eager" src="' + postImageUrl(post) + '" alt="' + post.categoryLabel + ' article cover"></figure>' +
        "<h1>" + post.title + "</h1>" +
        '<p class="muted">' + formatDate(post.publishedAt) + " • " + post.readTime + " min read • " + post.categoryLabel + "</p>" +
        '<div class="ad-slot" style="margin: 1rem 0;">AdSense In-Content Placeholder</div>' +
        post.contentHtml +
        '<div class="ad-slot" style="margin-top: 1.2rem;">AdSense In-Content Placeholder</div>';

      var related = posts.filter(function (item) {
        return item.slug !== slug && item.category === post.category;
      }).slice(0, 3);

      if (relatedWrap) {
        relatedWrap.innerHTML = related.map(function (item) {
          return (
            '<article class="card">' +
            '<a class="card-media" href="' + window.SiteUtils.withPrefix("blog/" + item.slug + "/") + '"><img loading="lazy" src="' + postImageUrl(item) + '" alt="' + item.categoryLabel + ' article illustration"></a>' +
            '<h3><a href="' + window.SiteUtils.withPrefix("blog/" + item.slug + "/") + '\">' + item.title + "</a></h3>" +
            "<p>" + item.excerpt + "</p>" +
            "</article>"
          );
        }).join("");
      }

      if (readMoreWrap) {
        var suggestions = posts.filter(function (item) {
          return item.slug !== slug;
        }).slice(0, 4);
        readMoreWrap.innerHTML = suggestions.map(function (item) {
          return '<a class="card" href="' + window.SiteUtils.withPrefix("blog/" + item.slug + "/") + '\"><span class="card-media"><img loading="lazy" src="' + postImageUrl(item) + '" alt="' + item.categoryLabel + ' article illustration"></span><h3>' + item.title + '</h3><p>' + item.excerpt + '</p></a>';
        }).join("");
      }
    })
    .catch(function () {
      articleWrap.innerHTML = '<p class="muted">Unable to load this article right now.</p>';
    });
})();