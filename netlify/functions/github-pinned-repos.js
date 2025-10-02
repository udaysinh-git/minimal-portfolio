exports.handler = async function(event, context) {
  // Import node-fetch using dynamic import
  const fetch = (await import('node-fetch')).default;

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
    const username = 'udaysinh-git'; // Your GitHub username
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      throw new Error("GITHUB_TOKEN is not defined in environment variables");
    }
    
    // Fetch pinned repositories using GitHub GraphQL API
    const pinnedQuery = {
      query: `
        {
          user(login: "${username}") {
            pinnedItems(first: 6, types: REPOSITORY) {
              edges {
                node {
                  ... on Repository {
                    name
                    description
                    url
                    createdAt
                    pushedAt
                    stargazerCount
                    forkCount
                  }
                }
              }
            }
          }
        }
      `
    };
    
    const pinnedResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pinnedQuery)
    });
    
    if (!pinnedResponse.ok) {
      throw new Error(`GitHub API error: ${pinnedResponse.statusText}`);
    }
    
    const pinnedData = await pinnedResponse.json();
    
    if (pinnedData.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(pinnedData.errors)}`);
    }
    
    // Format pinned repos data
    const pinnedRepos = pinnedData.data.user.pinnedItems.edges.map(edge => {
      const repo = edge.node;
      return {
        name: repo.name,
        description: repo.description,
        html_url: repo.url,
        created_at: repo.createdAt,
        pushed_at: repo.pushedAt,
        stargazers_count: repo.stargazerCount,
        forks_count: repo.forkCount
      };
    });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(pinnedRepos)
    };
  } catch (error) {
    console.error("Error fetching pinned repos:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
