async function loadPosts() {
  var prefix = window.SiteUtils ? window.SiteUtils.prefix : "";
  var response = await fetch(prefix + "data/posts.json");
  if (!response.ok) {
    throw new Error("Unable to load posts.");
  }
  var posts = await response.json();
  return posts.sort(function (a, b) {
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  }).map(function (post) {
    if (!post.image) {
      post.image = "assets/img/categories/" + post.category + ".svg";
    }
    return post;
  });
}

function postImageUrl(post) {
  var prefix = window.SiteUtils ? window.SiteUtils.prefix : "";
  return prefix + (post.image || ("assets/img/categories/" + post.category + ".svg"));
}

function formatDate(dateString) {
  var date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function slugToTitle(slug) {
  return slug
    .split("-")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
