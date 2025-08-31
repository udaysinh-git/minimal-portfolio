// Comments System Handler
class CommentsSystem {
  constructor() {
    this.config = null;
    this.giscusLoaded = false;
    this.currentTheme = null;
    this.init();
  }

  async init() {
    try {
      // Load configuration
      await this.loadConfig();
      
      // Set initial theme first
      this.setInitialTheme();
      
      // Initialize comments with correct theme
      this.initComments();
      
      // Handle theme changes
      this.handleThemeChanges();
    } catch (error) {
      console.error('Failed to initialize comments system:', error);
      this.showFallbackMessage();
    }
  }

  async loadConfig() {
    try {
      const response = await fetch('/.netlify/functions/giscus-config');
      const data = await response.json();
      
      if (data.success) {
        this.config = data.config;
      } else {
        throw new Error('Failed to load configuration');
      }
    } catch (error) {
      // Fallback to default config
      this.config = {
        repo: 'udaysinh-git/minimal-portfolio',
        repoId: 'R_kgDONhEmgA',
        category: 'Announcements',
        categoryId: 'DIC_kwDONhEmgM4CuyH4',
        mapping: 'pathname',
        strict: false,
        reactionsEnabled: true,
        emitMetadata: false,
        inputPosition: 'bottom',
        theme: 'light',
        lang: 'en'
      };
    }
  }

  initComments() {
    if (!this.config) return;

    // Check if Giscus script is already loaded
    if (window.giscus) {
      this.loadGiscus();
      return;
    }

    // Get current theme before loading script
    const currentTheme = this.getCurrentTheme();
    console.log('Loading Giscus with theme:', currentTheme);

    // Load Giscus script with correct theme
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', this.config.repo);
    script.setAttribute('data-repo-id', this.config.repoId);
    script.setAttribute('data-category', this.config.category);
    script.setAttribute('data-category-id', this.config.categoryId);
    script.setAttribute('data-mapping', this.config.mapping);
    script.setAttribute('data-strict', this.config.strict);
    script.setAttribute('data-reactions-enabled', this.config.reactionsEnabled);
    script.setAttribute('data-emit-metadata', this.config.emitMetadata);
    script.setAttribute('data-input-position', this.config.inputPosition);
    script.setAttribute('data-theme', currentTheme); // Set correct theme
    script.setAttribute('data-lang', this.config.lang);
    script.crossOrigin = 'anonymous';
    script.async = true;

    script.onload = () => {
      this.giscusLoaded = true;
      this.loadGiscus();
    };

    script.onerror = () => {
      console.error('Failed to load Giscus script');
      this.showFallbackMessage();
    };

    const container = document.querySelector('.comments-wrapper');
    if (container) {
      container.appendChild(script);
    }
  }

  loadGiscus() {
    if (!window.giscus || !this.giscusLoaded) return;

    try {
      window.giscus.render();
      
      // Double-check theme after render
      setTimeout(() => {
        const expectedTheme = this.getCurrentTheme();
        console.log('Ensuring Giscus theme is:', expectedTheme);
        window.giscus.setTheme(expectedTheme);
      }, 200);
    } catch (error) {
      console.error('Failed to render Giscus:', error);
      this.showFallbackMessage();
    }
  }

  setInitialTheme() {
    // Set initial theme when page loads
    this.currentTheme = this.getCurrentTheme();
    this.updateContainerTheme();
    console.log('Initial theme set to:', this.currentTheme);
  }

  handleThemeChanges() {
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const newTheme = this.getCurrentTheme();
          if (newTheme !== this.currentTheme) {
            console.log('Theme changed from', this.currentTheme, 'to', newTheme);
            this.currentTheme = newTheme;
            this.updateGiscusTheme();
            this.updateContainerTheme();
          }
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Also listen for theme toggle button clicks
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        // Small delay to allow theme class to update
        setTimeout(() => {
          const newTheme = this.getCurrentTheme();
          if (newTheme !== this.currentTheme) {
            console.log('Theme toggle: changing from', this.currentTheme, 'to', newTheme);
            this.currentTheme = newTheme;
            this.updateGiscusTheme();
            this.updateContainerTheme();
          }
        }, 100);
      });
    }
  }

  updateGiscusTheme() {
    if (!window.giscus || !this.giscusLoaded) return;

    try {
      const theme = this.getCurrentTheme();
      console.log('Updating Giscus theme to:', theme);
      window.giscus.setTheme(theme);
    } catch (error) {
      console.error('Failed to update Giscus theme:', error);
    }
  }

  updateContainerTheme() {
    const container = document.querySelector('.comments-wrapper');
    if (container) {
      const theme = this.getCurrentTheme();
      container.setAttribute('data-theme', theme);
    }
  }

  getCurrentTheme() {
    // Always return dark theme for comments
    return 'dark';
  }

  showFallbackMessage() {
    const container = document.querySelector('.comments-wrapper');
    if (container) {
      container.innerHTML = `
        <div class="comments-fallback">
          <div class="fallback-content">
            <h4>💬 Comments Temporarily Unavailable</h4>
            <p>We're experiencing some technical difficulties with our comments system. Please try refreshing the page or check back later.</p>
            <div class="fallback-actions">
              <button onclick="window.location.reload()" class="fallback-btn">🔄 Refresh Page</button>
              <a href="mailto:contact@udaysinh.netlify.app?subject=Comment on ${encodeURIComponent(document.title)}" class="fallback-btn">📧 Email Comment</a>
            </div>
          </div>
        </div>
      `;
    }
  }
}

// Initialize comments system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on blog post pages
  if (document.querySelector('.post-content')) {
    new CommentsSystem();
  }
});

// Export for potential use in other scripts
window.CommentsSystem = CommentsSystem;
