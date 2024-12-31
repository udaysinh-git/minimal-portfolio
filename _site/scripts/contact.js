document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const recaptchaSiteKey = '6LeTl6oqAAAAAMqp0IdSwgdo1M8mhkxcB2wFVVLu';

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Calculate session duration
    const sessionStartTime = localStorage.getItem('sessionStartTime');
    const sessionDurationMs = Date.now() - sessionStartTime;
    const hours = Math.floor(sessionDurationMs / 3600000);
    const minutes = Math.floor((sessionDurationMs % 3600000) / 60000);
    const seconds = Math.floor((sessionDurationMs % 60000) / 1000);
    const sessionDuration = `${hours}h ${minutes}m ${seconds}s`;

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
      data.sessionDuration = sessionDuration; // Add session duration to data

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
    let currentTheme = null;
    themeClassList.forEach((theme) => {
      if (document.body.classList.contains(theme)) {
        currentTheme = theme;
        socialIcons.forEach((icon) => {
          icon.classList.remove(...themeClassList);
          icon.classList.add(theme);
        });
      }
    });

    // Fix button text color based on theme
    const button = document.querySelector('button');
    const lightThemes = [
      'light-mode',
      'pastel-mode',
      'solarized-light-mode',
      'material-light-mode',
      'eye-soothing-mode'
    ];

    if (lightThemes.includes(currentTheme)) {
      button.style.color = '#000'; // Set text color to black for light themes
    } else {
      button.style.color = '#fff'; // Set text color to white for dark themes
    }
  }

  // Initial update
  updateIconFilters();

  // Listen for theme changes
  const observer = new MutationObserver(updateIconFilters);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
});