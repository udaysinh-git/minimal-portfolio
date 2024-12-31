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

<form id="contact-form" method="post">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="message">Message:</label>
  <textarea id="message" name="message" rows="4" required></textarea>
  
  <!-- Google reCAPTCHA -->
  <div class="g-recaptcha" data-sitekey="6LeTl6oqAAAAAMqp0IdSwgdo1M8mhkxcB2wFVVLu"></div>

  <button type="submit">Send</button>
</form>

<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<script src="/src/scripts/contact.js"></script>