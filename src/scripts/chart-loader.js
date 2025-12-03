// Lazy load Chart.js only when needed
function loadChartJS() {
  return new Promise((resolve, reject) => {
    if (typeof Chart !== 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Only initialize charts when Chart.js is loaded and DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  const chartElements = document.querySelectorAll('canvas[id*="chart"], canvas[id*="Chart"]');

  if (chartElements.length > 0) {
    loadChartJS().then(() => {
      // Initialize charts here after Chart.js is loaded
      // console.log('Chart.js loaded successfully');
    }).catch(error => {
      console.error('Failed to load Chart.js:', error);
    });
  }
});
