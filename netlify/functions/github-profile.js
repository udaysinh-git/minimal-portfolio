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
    const username = 'udaysinh-git'; // Your GitHub username
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      throw new Error("GITHUB_TOKEN is not defined in environment variables");
    }
    
    // Fetch profile
    const profileResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Authorization': `token ${token}`
      }
    });
    
    if (!profileResponse.ok) {
      throw new Error(`GitHub API error: ${profileResponse.statusText}`);
    }
    
    const profileData = await profileResponse.json();
    
    // Fetch commits count
    const commitsResponse = await fetch(`https://api.github.com/search/commits?q=author:${username}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.cloak-preview'
      }
    });
    
    if (!commitsResponse.ok) {
      throw new Error(`GitHub API error: ${commitsResponse.statusText}`);
    }
    
    const commitsData = await commitsResponse.json();
    
    // Return GitHub profile data with commits
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        profile: profileData,
        totalCommits: commitsData.total_count
      })
    };
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
