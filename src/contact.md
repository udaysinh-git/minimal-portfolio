---
layout: layout.njk
title: Contact
---

# Contact Me

Feel free to reach out to me through the form below or connect with me on my social media profiles.

---

<br>
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

---

<br>
<br>

<form id="contact-form" action="/.netlify/functions/contact" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>

<label for="email">Email:</label>
<input type="email" id="email" name="email" required>

<label for="message">Message:</label>
<textarea id="message" name="message" rows="4" required></textarea>

  <!-- Cloudflare Turnstile widget -->
  <div class="cf-turnstile" data-sitekey="0x4AAAAAABg0iupa1OkJ8bDH"></div>
  
  <button type="submit">Send</button>
</form>
<br>
<br>
<!-- Cloudflare Turnstile Script -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<script src="/scripts/contact.js"></script>
