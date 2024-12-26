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

  // Add GitHub profile data
  eleventyConfig.addGlobalData("githubProfile", async () => {
    const fetch = (await import("node-fetch")).default;
    const username = 'udaysinh-git';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      console.error("GITHUB_TOKEN is not defined in the environment variables.");
      return {};
    }

    try {
      const profileResponse = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });

      if (!profileResponse.ok) {
        console.error("Error fetching GitHub profile:", profileResponse.statusText);
        return {};
      }

      const profileData = await profileResponse.json();

      const commitsResponse = await fetch(`https://api.github.com/search/commits?q=author:${username}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.cloak-preview'
        }
      });

      if (!commitsResponse.ok) {
        console.error("Error fetching GitHub commits:", commitsResponse.statusText);
        return {};
      }

      const commitsData = await commitsResponse.json();

      return {
        profile: profileData,
        totalCommits: commitsData.total_count
      };
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      return {};
    }
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

  // Add languageStats global data
  eleventyConfig.addGlobalData("languageStats", async () => {
    const fetch = (await import("node-fetch")).default;
    const username = 'udaysinh-git';
    const token = process.env.GITHUB_TOKEN;
  
    if (!token) {
      console.error("GITHUB_TOKEN is not defined in the environment variables.");
      return {};
    }
  
    try {
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          'Authorization': `token ${token}`
        }
      });
  
      if (!reposResponse.ok) {
        console.error("Error fetching repositories:", reposResponse.statusText);
        return {};
      }
  
      const repos = await reposResponse.json();
      const languageCounts = {};
  
      for (const repo of repos) {
        const languagesResponse = await fetch(repo.languages_url, {
          headers: {
            'Authorization': `token ${token}`
          }
        });
  
        if (!languagesResponse.ok) {
          console.error(`Error fetching languages for repo ${repo.name}:`, languagesResponse.statusText);
          continue;
        }
  
        const languages = await languagesResponse.json();
        for (const [language, count] of Object.entries(languages)) {
          languageCounts[language] = (languageCounts[language] || 0) + count;
        }
      }
  
      return languageCounts;
    } catch (error) {
      console.error("Error fetching language data:", error);
      return {};
    }
  });

  // Add contributionsData global data
  eleventyConfig.addGlobalData("contributionsData", async () => {
    const fetch = (await import("node-fetch")).default;
    const { DateTime } = require("luxon");
    const username = 'udaysinh-git';
    const token = process.env.GITHUB_TOKEN;
  
    if (!token) {
      console.error("GITHUB_TOKEN is not defined in the environment variables.");
      return { labels: [], data: [] };
    }
  
    const currentYear = DateTime.now().year;
    // Last 4 complete years + current year
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const contributionsPerYear = {};
  
    try {
      const queries = years.map(year => {
        const from = DateTime.fromObject({ year, month: 1, day: 1 }).toISO();
        const to = year === currentYear
          ? DateTime.now().toISO()
          : DateTime.fromObject({ year, month: 12, day: 31 }).toISO();
  
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
            throw new Error(`Failed to fetch contributions for ${year}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.errors) {
            throw new Error(`GraphQL errors for ${year}: ${JSON.stringify(data.errors)}`);
          }
          const total = data.data.user.contributionsCollection.contributionCalendar.totalContributions;
          contributionsPerYear[year] = total;
        });
      });
  
      await Promise.all(queries);
  
      // Reverse the years array once for chronological order
      const reversedYears = [...years].reverse();
      const labels = reversedYears.map(year => year.toString());
      const commits = reversedYears.map(year => contributionsPerYear[year] || 0);
  
      return { labels, data: commits };
    } catch (error) {
      console.error("Error fetching contributions data:", error);
      return { labels: [], data: [] };
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