const { DateTime } = require("luxon");
require('dotenv').config();

module.exports = function(eleventyConfig) {
  // Add a custom date filter
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
    return DateTime.fromISO(dateObj).toFormat(format);
  });

  // Add a collection for blog posts
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  // Add pinnedRepos global data
  eleventyConfig.addGlobalData("pinnedRepos", async () => {
    const fetch = (await import("node-fetch")).default;
    const username = 'udaysinh-git';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      console.error("GITHUB_TOKEN is not defined in the environment variables.");
      return [];
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

    try {
      const pinnedResponse = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pinnedQuery)
      });

      if (!pinnedResponse.ok) {
        console.error("Error fetching pinned repositories:", pinnedResponse.statusText);
        return [];
      }

      const pinnedData = await pinnedResponse.json();

      if (pinnedData.errors) {
        console.error("GraphQL errors:", pinnedData.errors);
        return [];
      }

      const pinnedRepos = pinnedData.data.user.pinnedItems.edges.map(edge => {
        const repo = edge.node;
        return {
          name: repo.name,
          description: repo.description,
          html_url: repo.url, // Map 'url' to 'html_url'
          created_at: repo.createdAt, // Map 'createdAt' to 'created_at'
          pushed_at: repo.pushedAt, // New field
          stargazers_count: repo.stargazerCount, // Map 'stargazerCount' to 'stargazers_count'
          forks_count: repo.forkCount // Map 'forkCount' to 'forks_count'
        };
      });

      return pinnedRepos;
    } catch (error) {
      console.error("Error fetching pinned repositories:", error);
      return [];
    }
  });

  // Add latestRepos global data
  eleventyConfig.addGlobalData("latestRepos", async () => {
    const fetch = (await import("node-fetch")).default;
    const username = 'udaysinh-git';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      console.error("GITHUB_TOKEN is not defined in the environment variables.");
      return [];
    }

    // Fetch all repositories
    try {
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=created&direction=desc`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });

      if (!reposResponse.ok) {
        console.error("Error fetching repositories:", reposResponse.statusText);
        return [];
      }

      const repos = await reposResponse.json();

      // Remove slicing to fetch all repositories
      const latestRepos = repos.map(repo => ({
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        created_at: repo.created_at,
        pushed_at: repo.pushed_at,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count
      }));

      return latestRepos;
    } catch (error) {
      console.error("Error fetching latest repositories:", error);
      return [];
    }
  });

  // Add current year to global data
  eleventyConfig.addGlobalData("currentYear", () => {
    return new Date().getFullYear();
  });

  // Passthrough copy for CSS
  eleventyConfig.addPassthroughCopy("src/styles.css");

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};