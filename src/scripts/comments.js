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
      
      // Initialize comments
      this.initComments();
      
      // Handle theme changes
      this.handleThemeChanges();
      
      // Set initial theme
      this.setInitialTheme();
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
      // Fallback to default config (these will be overridden by environment variables in production)
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
        theme: 'preferred_color_scheme',
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

    // Load Giscus script with dynamic theme
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
    script.setAttribute('data-theme', this.getCurrentTheme()); // Set initial theme
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

    const container = document.querySelector('.giscus-container');
    if (container) {
      container.appendChild(script);
    }
  }

  loadGiscus() {
    if (!window.giscus || !this.giscusLoaded) return;

    try {
      window.giscus.render();
      // Set initial theme after render
      setTimeout(() => {
        this.updateGiscusTheme();
      }, 100);
    } catch (error) {
      console.error('Failed to render Giscus:', error);
      this.showFallbackMessage();
    }
  }

  setInitialTheme() {
    // Set initial theme when page loads
    this.currentTheme = this.getCurrentTheme();
    this.updateGiscusTheme();
    
    // Fix text visibility after initial load
    setTimeout(() => {
      this.fixGiscusTextVisibility();
    }, 500);
  }

  handleThemeChanges() {
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const newTheme = this.getCurrentTheme();
          if (newTheme !== this.currentTheme) {
            this.currentTheme = newTheme;
            this.updateGiscusTheme();
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
            this.currentTheme = newTheme;
            this.updateGiscusTheme();
          }
        }, 50);
      });
    }
  }

  updateGiscusTheme() {
    if (!window.giscus || !this.giscusLoaded) return;

    try {
      const theme = this.getCurrentTheme();
      console.log('Updating Giscus theme to:', theme);
      
      // Add visual feedback during theme change
      const container = document.querySelector('.giscus-container');
      if (container) {
        container.classList.add('theme-changing');
      }
      
      // Update Giscus theme
      window.giscus.setTheme(theme);
      
      // Fix giscus text visibility after theme change
      setTimeout(() => {
        this.fixGiscusTextVisibility();
        if (container) {
          container.classList.remove('theme-changing');
        }
      }, 300);
    } catch (error) {
      console.error('Failed to update Giscus theme:', error);
    }
  }

  fixGiscusTextVisibility() {
    // Ensure giscus iframe has proper color scheme
    const giscusFrame = document.querySelector('.giscus-container iframe');
    if (giscusFrame) {
      // Set color scheme based on current theme
      const isDark = this.getCurrentTheme() === 'dark';
      giscusFrame.style.colorScheme = isDark ? 'dark' : 'light';
    }
  }

  getCurrentTheme() {
    const bodyClass = document.body.className;
    
    // Dark themes
    const darkThemes = [
      'dark-mode',
      'solarized-dark-mode',
      'monokai-mode',
      'dracula-mode',
      'gruvbox-dark-mode',
      'nord-mode',
      'one-dark-mode',
      'material-dark-mode'
    ];
    
    // Check if current theme is dark
    const isDarkTheme = darkThemes.some(theme => bodyClass.includes(theme));
    
    return isDarkTheme ? 'dark' : 'light';
  }

  showFallbackMessage() {
    const container = document.querySelector('.giscus-container');
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
