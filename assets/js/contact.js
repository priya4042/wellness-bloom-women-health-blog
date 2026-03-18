(function () {
  var form = document.getElementById("contact-form");
  var message = document.getElementById("contact-message");

  if (!form || !message) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = String(form.elements.name.value || "").trim();
    var email = String(form.elements.email.value || "").trim();
    var topic = String(form.elements.topic.value || "").trim();
    var details = String(form.elements.details.value || "").trim();

    if (!name || !email || !topic || !details) {
      message.textContent = "Please complete all fields before sending.";
      return;
    }

    var subject = encodeURIComponent("Wellness Bloom Contact: " + topic);
    var body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + details);
    window.location.href = "mailto:hello@wellnessbloom.example?subject=" + subject + "&body=" + body;

    message.textContent = "Your email app should open now. If it does not, email hello@wellnessbloom.example directly.";
  });
})();