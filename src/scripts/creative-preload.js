// Preload creative serverless endpoints (spotify, activities) on site entry
// Repeatedly preload creative serverless endpoints (spotify, activities) every 10 seconds
(function() {
	const endpoints = [
		'/.netlify/functions/spotify',
		'/.netlify/functions/activities'
	];

	function preloadEndpoints() {
		endpoints.forEach(url => {
			fetch(url, { method: 'GET', keepalive: true }).catch(() => {});
		});
	}

	// Initial load
	preloadEndpoints();
	// Repeat every 10 seconds
	setInterval(preloadEndpoints, 10000);
})();
