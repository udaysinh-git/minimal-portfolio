exports.handler = async function(event, context) {
  // Import node-fetch using dynamic import
  const fetch = (await import('node-fetch')).default;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const username = 'udaysinh-git';
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      throw new Error("GITHUB_TOKEN is not defined in environment variables");
    }
    
    // Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        'Authorization': `token ${token}`
      }
    });
    
    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.statusText}`);
    }
    
    const repos = await reposResponse.json();
    const languageCounts = {};
    
    // Fetch languages for each repository concurrently
    const languagePromises = repos.map(repo =>
      fetch(repo.languages_url, {
        headers: { 'Authorization': `token ${token}` }
      })
      .then(response => {
        if (!response.ok) {
          console.error(`Error fetching languages for ${repo.name}: ${response.statusText}`);
          return {};
        }
        return response.json();
      })
    );
    
    const languagesArray = await Promise.all(languagePromises);
    
    // Merge languages from all repos
    languagesArray.forEach(languages => {
      for (const [language, count] of Object.entries(languages)) {
        languageCounts[language] = (languageCounts[language] || 0) + count;
      }
    });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(languageCounts)
    };
  } catch (error) {
    console.error("Error fetching language stats:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
