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
    
    // Get current year and calculate past years
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const contributionsPerYear = {};
    
    // Fetch contributions for each year using GitHub GraphQL API
    const queries = years.map(year => {
      const from = `${year}-01-01T00:00:00Z`;
      const to = year === currentYear 
        ? new Date().toISOString()
        : `${year}-12-31T23:59:59Z`;
      
      const query = `
        {
          user(login: "${username}") {
            contributionsCollection(from: "${from}", to: "${to}") {
              contributionCalendar {
                totalContributions
              }
            }
          }
        }
      `;
      
      return fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch contributions for ${year}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.errors) {
          throw new Error(`GraphQL errors for ${year}`);
        }
        const total = data.data.user.contributionsCollection.contributionCalendar.totalContributions;
        contributionsPerYear[year] = total;
      });
    });
    
    // Wait for all queries to complete
    await Promise.all(queries);
    
    // Reverse years for chronological order in chart
    const reversedYears = [...years].reverse();
    const labels = reversedYears.map(year => year.toString());
    const data = reversedYears.map(year => contributionsPerYear[year] || 0);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ labels, data })
    };
  } catch (error) {
    console.error("Error fetching contributions:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
