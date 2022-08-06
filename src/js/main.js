import {
  animate,
  scroll,
  ScrollOffset,
  stagger,
  timeline,
  inView,
} from "motion";
import Splitting from "splitting";

function getCSSCustomProp(propKey, element = document.body, castAs = "string") {
  let response = getComputedStyle(element).getPropertyValue(propKey);

  if (response.length) {
    response = response.replace(/\'|"/g, "").trim();
  }

  switch (castAs) {
    case "number":
    case "int":
      return parseInt(response, 10);
    case "float":
      return parseFloat(response, 10);
    case "boolean":
    case "bool":
      return response === "true" || response === "1";
  }

  return response;
}

const EaseoutSine = getCSSCustomProp("--ease-out-sine");
const EaseinQuad = getCSSCustomProp("--ease-in-quad");
const EaseoutCubic = getCSSCustomProp("--ease-out-cubic");

function setCssCustomProp(propKey, element, value) {
  element.style.setProperty(propKey, value);
}

function shuffle(arr) {
  let currentIndex = arr.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }

  return arr;
}

function initPageAnimations() {
  const background = document.querySelector("[data-page-animation-background]");
  const container = document.querySelector("[data-page-animation-container]");
  const content = document.querySelector("[data-page-animation-content]");
  const title = document.querySelector("[data-page-animation-title]");
  const { chars } = Splitting({ target: title, by: "chars" })[0];
  const sequence = [];

  if (title) {
    sequence.push([
      shuffle(chars),
      { y: ["-100%", 0], opacity: [0, 1] },
      {
        duration: 0.6,
        delay: stagger(0.05, {
          easing: EaseinQuad,
        }),
      },
    ]);
  }

  if (content) {
    sequence.push([
      content,
      { opacity: [0, 1] },
      { easing: EaseoutCubic, at: "-0.75" },
    ]);
  }

  timeline(sequence);

  if (background) {
    scroll(animate(background, { opacity: [0, 1, 1, 0] }), {
      target: container,
      offset: ["start start", "end end", "start start", "end start"],
    });
  }
}

function intiScrollProgressAnimations() {
  const scrollProgressContainer = document.querySelectorAll(
    "[data-page-animation-scroll-progress]"
  );

  Array.from(scrollProgressContainer).map((container) => {
    scroll(
      ({ y }) => {
        setCssCustomProp("--scroll-progress", container, y.progress);
      },
      {
        target: container,
        offset: ["center end", "end end"],
      }
    );
  });
}

function initFadeInViewAnimations() {
  const allAnimations = Array.from(
    document.querySelectorAll("[data-page-animation-fade-in-view]")
  );

  Array.from(allAnimations).map((container) => {
    container.style.opacity = 0;

    inView(
      container,
      (info) => {
        animate(info.target, { opacity: [0, 1] }, { duration: 1 });
      },
      { amount: 0.5 }
    );
  });
}

function initCustomClassAnimations() {
  const allAnimations = document.querySelectorAll(
    "[data-page-animation-custom-class-in-view]"
  );

  Array.from(allAnimations).map((container) => {
    const baseCls = container.getAttribute(
      "data-page-animation-custom-class-in-view"
    );

    container.classList.add(`${baseCls}--not-in-view`);

    inView(
      container,
      (info) => {
        info.target.classList.remove(`${baseCls}--not-in-view`);
        info.target.classList.add(`${baseCls}--in-view`);
      },
      { amount: 0.5 }
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPageAnimations();
  intiScrollProgressAnimations();
  initFadeInViewAnimations();
  initCustomClassAnimations();

  inView(
    document.querySelector(".short-bio__image"),
    (info) => {
      timeline([
        [info.target, { opacity: [0, 1] }, { duration: 0.5 }],
        [
          info.target.querySelector("img"),
          {
            scale: [1.2, 1],
            filter: ["brightness(2)", "brightness(1)"],
          },
          { easing: EaseoutSine, duration: 0.7, at: "-0.5" },
        ],
      ]);
    },
    { amount: 0.5 }
  );
});
