const CleanCSS = require("clean-css");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const esbuild = require("esbuild");
const fs = require("fs");


function minifyCSS(source, output_path) {
  if (
    !output_path ||
    !output_path.endsWith(".css") ||
    !process.env.NODE_ENV === "production"
  )
    return source;

  const result = new CleanCSS({
    level: 2,
  })
    .minify(source)
    .styles.trim();
  console.log(
    `minify ${output_path}`,
    source.length,
    `→`,
    result.length,
    `(${((1 - result.length / source.length) * 100).toFixed(2)}% reduction)`
  );
  return result;
}

function imageFileName({ src, id, format }) {
  const extension = path.extname(src);
  const name = path.basename(src, extension);

  return `${name}_${id}.${format}`;
}

async function imageWithDetailShortcode(
  src,
  alt,
  sizes,
  detailSrc,
  detailMedia,
  detailSizes
) {
  const imageFormats = ["avif", "webp", "jpeg"];
  const imageSizes = {
    768: "medium",
    1280: "large",
  };

  let metadata = await Image(src, {
    widths: Object.keys(imageSizes).map((k) => +k),
    formats: imageFormats,
    urlPath: "./assets/images",
    outputDir: "./_site/assets/images",
    filenameFormat: (id, src, _width, format) =>
      imageFileName({
        src,
        id,
        format,
      }),
  });

  let detailMetadata =
    detailSrc && detailMedia
      ? await Image(detailSrc, {
          widths: Object.keys(imageSizes).map((k) => +k),
          formats: imageFormats,
          urlPath: "./assets/images",
          outputDir: "./_site/assets/images",
          filenameFormat: (id, src, _width, format) =>
            imageFileName({
              src,
              id,
              format,
            }),
        })
      : null;

  let imageAttributes = {
    alt,
    sizes,
  };

  let lowsrc = metadata.jpeg[0];

  const detailOutput = detailMetadata
    ? Object.values(detailMetadata)
        .map((imageFormat) => {
          return `<source type="${imageFormat[0].sourceType}"
            srcset="${imageFormat
              .map((entry) => `/${entry.srcset}`)
              .join(", ")}"
            media="${detailMedia}"
            sizes="${detailSizes}">`;
        })
        .join("\n")
    : "";

  const sources =
    detailOutput +
    Object.values(metadata)
      .map((imageFormat) => {
        return `<source type="${
          imageFormat[0].sourceType
        }" srcset="${imageFormat
          .map((entry) => `/${entry.srcset}`)
          .join(", ")}" sizes="${imageAttributes.sizes}">`;
      })
      .join("\n");

  return `<picture>
    ${sources}
      <img
        src="/${lowsrc.url}"
        width="${lowsrc.width}"
        height="${lowsrc.height}"
        alt="${imageAttributes.alt}"
        loading="lazy"
        decoding="async">
    </picture>`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./src/js/");
  eleventyConfig.addWatchTarget("./src/css/");

  eleventyConfig.addTransform("cssminFile", minifyCSS);

  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/videos");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/app-images");
  eleventyConfig.addPassthroughCopy("src/assets/share");

  eleventyConfig.addNunjucksFilter("jsmin", (pageId) => {
    try {
      const code = fs.readFileSync(
        `src/js/critical/${pageId}.critical.js`,
        "utf8"
      );

      const minified = esbuild.transformSync(code, {
        minify: true,
        target: "es6",
      });

      return minified.code;
    } catch (e) {}

    return null;
  });

  eleventyConfig.addNunjucksFilter("cssmin", (pageId) => {
    try {
      const code = fs.readFileSync(
        `src/css/critical/${pageId}.critical.css`,
        "utf8"
      );

      return new CleanCSS({}).minify(code).styles;
    } catch (e) {}

    return null;
  });

  eleventyConfig.addNunjucksAsyncShortcode(
    "imageWithDetail",
    imageWithDetailShortcode
  );

  return {
    passthroughFileCopy: true,
    templateFormats: ["njk", "11ty.js"],
  };
};
