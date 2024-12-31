document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      alert('Please complete the reCAPTCHA.');
      return;
    }

    const formData = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
      recaptcha: recaptchaResponse,
    };

    try {
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        form.reset();
        grecaptcha.reset();
      } else {
        alert(result.message || 'There was an error submitting the form.');
      }
    } catch (error) {
      alert('There was an error submitting the form. Please try again later.');
      console.error(error);
    }
  });

  // Existing social icon theme handling
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