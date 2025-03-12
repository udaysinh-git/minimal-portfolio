const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
require('dotenv').config();

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  // Add a custom date filter
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
    return DateTime.fromISO(dateObj).toFormat(format);
  });

  // Add a custom filter to filter blog posts by tag
  eleventyConfig.addFilter("filterByTag", (posts, tag) => {
    return posts.filter(post => {
      return post && post.data && Array.isArray(post.data.tags) && post.data.tags.includes(tag);
    });
  });

  eleventyConfig.addFilter("intersect", function(array1, array2) {
    return array1.filter(value => array2.includes(value));
  });

  // Add a collection for blog posts
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.addFilter("rss_date", (dateObj) => {
    return DateTime.fromISO(dateObj).toRFC2822();
  });

  // Add a collection for unique tags
  eleventyConfig.addCollection("tagsList", function(collectionApi) {
    let tags = new Set();
    collectionApi.getAll().forEach(item => {
      if("tags" in item.data) {
        item.data.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  });

  // Add current year to global data
  eleventyConfig.addGlobalData("currentYear", () => {
    return new Date().getFullYear();
  });

  // Passthrough copy for CSS
  eleventyConfig.addPassthroughCopy("src/styles/base.css");
  eleventyConfig.addPassthroughCopy("src/styles/footer.css");
  eleventyConfig.addPassthroughCopy("src/styles/header.css");
  eleventyConfig.addPassthroughCopy("src/styles/main.css");
  eleventyConfig.addPassthroughCopy("src/styles/themes.css");
  eleventyConfig.addPassthroughCopy("src/styles/blogs.css");
  eleventyConfig.addPassthroughCopy("src/styles/contact.css");
  eleventyConfig.addPassthroughCopy("src/styles/github.css");
  eleventyConfig.addPassthroughCopy("src/styles/styles.css");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/scripts");
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};