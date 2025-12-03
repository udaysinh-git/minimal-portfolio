// Performance monitoring and optimization for minimal-portfolio
(function () {
  'use strict';

  // Track performance metrics
  const perfMonitor = {
    startTime: performance.now(),

    // Log resource loading metrics
    logResourceMetrics() {
      if ('getEntriesByType' in performance) {
        const resources = performance.getEntriesByType('resource');
        const scripts = resources.filter(r => r.name.includes('.js'));
        const stylesheets = resources.filter(r => r.name.includes('.css'));

        console.group('Resource Loading Performance');
        // console.log(`Scripts loaded: ${scripts.length}`);
        // console.log(`Stylesheets loaded: ${stylesheets.length}`);

        // Identify large resources
        const largeResources = resources.filter(r => r.transferSize > 50000);
        if (largeResources.length > 0) {
          console.warn('Large resources (>50KB):', largeResources.map(r => ({
            name: r.name.split('/').pop(),
            size: Math.round(r.transferSize / 1024) + 'KB'
          })));
        }

        console.groupEnd();
      }
    },

    // Check for unused CSS
    checkUnusedCSS() {
      const stylesheets = document.styleSheets;
      let unusedSelectors = 0;

      try {
        for (let sheet of stylesheets) {
          if (sheet.href && sheet.href.includes('font-awesome')) {
            console.warn('Font Awesome detected - consider using custom icons instead');
          }
        }
      } catch (e) {
        // CORS might prevent checking external stylesheets
      }
    }
  };

  // Run performance checks after page load
  window.addEventListener('load', () => {
    // Delay to allow all resources to finish loading
    setTimeout(() => {
      perfMonitor.logResourceMetrics();
      perfMonitor.checkUnusedCSS();

      const loadTime = performance.now() - perfMonitor.startTime;
      // console.log(`Page load completed in ${Math.round(loadTime)}ms`);

      // Check Core Web Vitals if available
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'largest-contentful-paint') {
              // console.log(`LCP: ${Math.round(entry.startTime)}ms`);
            }
          });
        });

        try {
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // LCP might not be supported
        }
      }
    }, 1000);
  });

  // Export for debugging
  window.perfMonitor = perfMonitor;
})();
