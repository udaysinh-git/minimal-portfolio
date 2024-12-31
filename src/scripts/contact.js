document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const recaptchaSiteKey = '6LeTl6oqAAAAAMqp0IdSwgdo1M8mhkxcB2wFVVLu'; // Replace with your actual site key

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Execute reCAPTCHA v3
    grecaptcha.ready(async () => {
      const token = await grecaptcha.execute(recaptchaSiteKey, { action: 'submit' });
      document.getElementById('recaptchaToken').value = token;

      // Gather form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Send data to Netlify serverless function
      try {
        const response = await fetch('/.netlify/functions/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          // Display success message
          alert(result.message);
          form.reset(); // Reset the form
        } else {
          // Display error message from server
          alert(result.message || 'There was an error submitting the form.');
        }
      } catch (error) {
        // Display network error
        alert('There was an error submitting the form. Please try again later.');
        console.error('Error:', error);
      }
    });
  });

  // Existing social icon theme handling (optional)
  const socialIcons = document.querySelectorAll('.social-links img');
  const themeClassList = [
    'dark-mode',
    'light-mode',
    'pastel-mode',
    'eye-soothing-mode',
    'solarized-dark-mode',
    'solarized-light-mode',
    'monokai-mode',
    'dracula-mode',
    'gruvbox-dark-mode',
    'nord-mode',
    'one-dark-mode',
    'material-dark-mode',
    'material-light-mode',
  ];

  function updateIconFilters() {
    themeClassList.forEach((theme) => {
      if (document.body.classList.contains(theme)) {
        socialIcons.forEach((icon) => {
          icon.classList.remove(...themeClassList);
          icon.classList.add(theme);
        });
      }
    });
  }

  // Initial update
  updateIconFilters();

  // Listen for theme changes
  const observer = new MutationObserver(updateIconFilters);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
});