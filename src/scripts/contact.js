document.addEventListener('DOMContentLoaded', () => {
  // Clear the formSubmitted flag on page load
  localStorage.removeItem('formSubmitted');

  const form = document.getElementById('contact-form');
  
  // Only proceed if the form exists (we're on the contact page)
  if (!form) {
    return;
  }
  
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Check if the form has already been submitted
    if (localStorage.getItem('formSubmitted')) {
      submitButton.textContent = 'Already Submitted';
      return;
    }

    // Get session start time from localStorage
    const sessionStartTime = localStorage.getItem('sessionStartTime');
    if (!sessionStartTime) {
      submitButton.textContent = 'Session Error';
      return;
    }

    // Calculate session duration
    const sessionDurationMs = Date.now() - parseInt(sessionStartTime, 10);
    const hours = Math.floor(sessionDurationMs / 3600000);
    const minutes = Math.floor((sessionDurationMs % 3600000) / 60000);
    const seconds = Math.floor((sessionDurationMs % 60000) / 1000);
    const sessionDuration = `${hours}h ${minutes}m ${seconds}s`;

    // Get Turnstile token from widget
    const turnstileToken = document.querySelector('input[name="cf-turnstile-response"]')?.value;
    if (!turnstileToken) {
      submitButton.textContent = 'Captcha Required';
      return;
    }

    // Gather form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    data.turnstileToken = turnstileToken; // Add Turnstile token
    data.sessionDuration = sessionDuration; // Add session duration to data

    // Change button text to animated dots
    submitButton.textContent = '...';
    submitButton.disabled = true;

    // Send data to Netlify serverless function
    try {
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Change button text to "Submitted"
        submitButton.textContent = 'Submitted';
        form.reset(); // Reset the form
        localStorage.setItem('formSubmitted', 'true'); // Set form submitted flag
      } else {
        // Removed displaying error message on button text
        console.error('Error:', result.message);
      }
    } catch (error) {
      // Removed displaying network error on button text
      console.error('Error:', error);
    } finally {
      // Re-enable the button after a delay
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Send';
      }, 3000);
    }
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