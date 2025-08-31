exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Giscus configuration (these values are public and not sensitive)
    const giscusConfig = {
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
      lang: 'en',
      loading: 'lazy'
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        config: giscusConfig,
        message: 'Giscus configuration loaded successfully'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to load Giscus configuration',
        details: error.message
      })
    };
  }
};
