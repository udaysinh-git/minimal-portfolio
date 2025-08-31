// Comments System Handler
class CommentsSystem {
  constructor() {
    this.config = null;
    this.giscusLoaded = false;
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

    // Load Giscus script
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
    script.setAttribute('data-theme', this.config.theme);
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
    } catch (error) {
      console.error('Failed to render Giscus:', error);
      this.showFallbackMessage();
    }
  }

  handleThemeChanges() {
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this.updateGiscusTheme();
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  updateGiscusTheme() {
    if (!window.giscus || !this.giscusLoaded) return;

    try {
      const currentTheme = this.getCurrentTheme();
      window.giscus.setTheme(currentTheme);
    } catch (error) {
      console.error('Failed to update Giscus theme:', error);
    }
  }

  getCurrentTheme() {
    const bodyClass = document.body.className;
    
    if (bodyClass.includes('dark-mode') || 
        bodyClass.includes('solarized-dark-mode') || 
        bodyClass.includes('monokai-mode') || 
        bodyClass.includes('dracula-mode') || 
        bodyClass.includes('gruvbox-dark-mode') || 
        bodyClass.includes('nord-mode') || 
        bodyClass.includes('one-dark-mode') || 
        bodyClass.includes('material-dark-mode')) {
      return 'dark';
    } else {
      return 'light';
    }
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
