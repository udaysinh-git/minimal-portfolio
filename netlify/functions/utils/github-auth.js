/**
 * Helper functions for GitHub API authentication and request handling
 */

// Creates HTTP headers with GitHub authentication
const getGitHubHeaders = (token) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };
};

// For GraphQL API
const getGraphQLHeaders = (token) => {
  return {
    ...getGitHubHeaders(token),
    'Content-Type': 'application/json'
  };
};

// Standard response headers for all API calls
const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Handle and format error responses
const handleError = (error) => {
  console.error(`GitHub API Error: ${error.message}`);
  return {
    statusCode: 500,
    headers: responseHeaders,
    body: JSON.stringify({ error: error.message })
  };
};

module.exports = {
  getGitHubHeaders,
  getGraphQLHeaders,
  responseHeaders,
  handleError
};
