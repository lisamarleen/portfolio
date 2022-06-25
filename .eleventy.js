const CleanCSS = require("clean-css");
const fs = require("fs");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");

  eleventyConfig.addFilter("cssmin", (pageId) => {
    const css = fs.readFileSync(`src/css/${pageId}.critical.css`, "utf8");
    return new CleanCSS({}).minify(css).styles;
  });

  return {
    passthroughFileCopy: true,
  };
};
