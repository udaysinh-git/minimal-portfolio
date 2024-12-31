---
layout: layout.njk
title: Contact
---

# Contact Me

Feel free to reach out to me through the form below or connect with me on my social media profiles.

<div class="social-links">
  <a href="https://github.com/udaysinh-git" target="_blank">
    <img src="https://img.icons8.com/ios-glyphs/30/000000/github.png" alt="GitHub">
  </a>
  <a href="https://www.linkedin.com/in/udaysinh-me/" target="_blank">
    <img src="https://img.icons8.com/ios-glyphs/30/000000/linkedin.png" alt="LinkedIn">
  </a>
  <a href="https://x.com/udaysinh_me" target="_blank">
    <img src="https://img.icons8.com/ios-glyphs/30/000000/twitter.png" alt="X">
  </a>
</div>

<form id="contact-form" action="/.netlify/functions/contact" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="message">Message:</label>
  <textarea id="message" name="message" rows="4" required></textarea>
  
  <!-- Hidden field to store reCAPTCHA token -->
  <input type="hidden" name="recaptchaToken" id="recaptchaToken">
  
  <button type="submit">Send</button>
</form>

<!-- reCAPTCHA v3 Script -->
<script src="https://www.google.com/recaptcha/api.js?render=6LeTl6oqAAAAAMqp0IdSwgdo1M8mhkxcB2wFVVLu"></script>
<script src="/scripts/contact.js"></script>