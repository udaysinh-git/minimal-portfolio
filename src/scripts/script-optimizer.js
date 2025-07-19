// Optimized script loader for performance
class ScriptOptimizer {
  constructor() {
    this.loadedScripts = new Set();
    this.pendingScripts = new Map();
  }

  // Load script only when needed
  loadScript(src, options = {}) {
    if (this.loadedScripts.has(src)) {
      return Promise.resolve();
    }

    if (this.pendingScripts.has(src)) {
      return this.pendingScripts.get(src);
    }

    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = options.async !== false;
      script.defer = options.defer === true;
      
      script.onload = () => {
        this.loadedScripts.add(src);
        this.pendingScripts.delete(src);
        resolve();
      };
      
      script.onerror = () => {
        this.pendingScripts.delete(src);
        reject(new Error(`Failed to load script: ${src}`));
      };
      
      document.head.appendChild(script);
    });

    this.pendingScripts.set(src, promise);
    return promise;
  }

  // Load Chart.js only when charts are needed
  loadChartJS() {
    if (typeof Chart !== 'undefined') {
      return Promise.resolve();
    }
    return this.loadScript('https://cdn.jsdelivr.net/npm/chart.js');
  }

  // Check if page needs Chart.js
  needsCharts() {
    return document.querySelectorAll('canvas[id*="chart"], canvas[id*="Chart"]').length > 0;
  }

  // Initialize optimizations
  init() {
    // Defer non-critical operations
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.deferredInit();
      });
    } else {
      this.deferredInit();
    }
  }

  deferredInit() {
    // Load Chart.js only if needed
    if (this.needsCharts()) {
      this.loadChartJS().catch(console.error);
    }
  }
}

// Global instance
window.scriptOptimizer = new ScriptOptimizer();
window.scriptOptimizer.init();
