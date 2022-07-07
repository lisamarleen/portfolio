const CleanCSS = require("clean-css");
const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");

function imageFileName({ src, width, format, imageSizes }) {
  const extension = path.extname(src);
  const name = path.basename(src, extension);

  const size = imageSizes[width + ""];
  return `${name}_${size}.${format}`;
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
    filenameFormat: (id, src, width, format) =>
      imageFileName({
        src,
        width,
        format,
        imageSizes,
      }),
  });

  let detailMetadata =
    detailSrc && detailMedia
      ? await Image(detailSrc, {
          widths: Object.keys(imageSizes).map((k) => +k),
          formats: imageFormats,
          urlPath: "./assets/images",
          outputDir: "./_site/assets/images",
          filenameFormat: (id, src, width, format) =>
            imageFileName({
              src,
              width,
              format,
              imageSizes,
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
            srcset="${imageFormat.map((entry) => entry.srcset).join(", ")}" 
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
          .map((entry) => entry.srcset)
          .join(", ")}" sizes="${imageAttributes.sizes}">`;
      })
      .join("\n");

  return `<picture>
    ${sources}
      <img
        src="${lowsrc.url}"
        width="${lowsrc.width}"
        height="${lowsrc.height}"
        alt="${imageAttributes.alt}"
        loading="lazy"
        decoding="async">
    </picture>`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/images");

  eleventyConfig.addFilter("cssmin", (pageId) => {
    const css = fs.readFileSync(`src/css/${pageId}.critical.css`, "utf8");
    return new CleanCSS({}).minify(css).styles;
  });

  eleventyConfig.addNunjucksAsyncShortcode(
    "imageWithDetail",
    imageWithDetailShortcode
  );

  return {
    passthroughFileCopy: true,
  };
};
