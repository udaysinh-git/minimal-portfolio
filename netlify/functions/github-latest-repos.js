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
    
    // Fetch all repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=created&direction=desc`, 
      {
        headers: {
          'Authorization': `token ${token}`
        }
      }
    );
    
    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.statusText}`);
    }
    
    const repos = await reposResponse.json();
    
    // Format repo data
    const latestRepos = repos.map(repo => ({
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      created_at: repo.created_at,
      pushed_at: repo.pushed_at,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count
    }));
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(latestRepos)
    };
  } catch (error) {
    console.error("Error fetching latest repos:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
