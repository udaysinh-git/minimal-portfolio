const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Add a custom date filter
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy") => {
    return DateTime.fromJSDate(new Date()).toFormat(format);
  });

  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.addGlobalData("githubRepos", async () => {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch("https://api.github.com/users/udaysinh-git/repos");
    return await response.json();
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