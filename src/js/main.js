import {
  animate,
  inView,
  scroll,
  ScrollOffset,
  stagger,
  timeline,
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

const EaseIn = getCSSCustomProp("--ease-in");
const EaseOut = getCSSCustomProp("--ease-out");
const EaseInOut = getCSSCustomProp("--ease-in-out");
const EaseInSmooth = getCSSCustomProp("--ease-in-smooth");
const EaseOutSmooth = getCSSCustomProp("--ease-out-smooth");
const EaseInOutSmooth = getCSSCustomProp("--ease-in-out-smooth");

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

function initNav() {
  const navigations = document.querySelectorAll("nav a");

  Array.from(navigations).map((nav) => {
    const link = nav.getAttribute("href");

    if (link.startsWith("#")) {
      nav.addEventListener("click", (e) => {
        e.preventDefault();

        const linkedElem = document.getElementById(
          link.substring(1, link.length)
        );

        window.scrollTo({
          top: linkedElem ? linkedElem.offsetTop : "#",
          left: 0,
          behavior: "smooth",
        });

        window.location.hash = `#${link.substring(1, link.length)}`;
      });
    }
  });
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
      {
        rotateY: [25, 0],
        opacity: [0, 1],
        color: [
          getCSSCustomProp("--color-dark-blue"),
          getCSSCustomProp("--color-white"),
        ],
        filter: ["blur(2px)", "blur(0)"],
      },
      {
        duration: 1.2,
        delay: stagger(0.05),
        easing: EaseInSmooth,
      },
    ]);
  }

  if (content) {
    content.style.opacity = 0;

    sequence.push([
      content,
      { opacity: [0, 1] },
      {
        easing: EaseOutSmooth,
        at: "-0.25",
        duration: 1,
      },
    ]);
  }

  if (background) {
    scroll(
      animate(background, {
        opacity: [0, 1, 1, 0],
        clipPath: [
          "polygon(2vw 2vw, calc(100% - 2vw) 2vw, calc(100% - 2vw) calc(100% - 2vw), 2vw calc(100% - 2vw))",
          "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          "polygon(2vw 2vw, calc(100% - 2vw) 2vw, calc(100% - 2vw) calc(100% - 2vw), 2vw calc(100% - 2vw))",
        ],
      }),
      {
        target: container,
        offset: ["start start", "end end", "start start", "end start"],
      }
    );
  }

  timeline(sequence);
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
        offset: ScrollOffset.Enter,
      }
    );
  });
}

function initFadeInViewAnimations() {
  const allAnimations = Array.from(
    document.querySelectorAll("[data-page-animation-fade-in-view]")
  );

  Array.from(allAnimations).map((container) => {
    const amount = container.getAttribute("data-in-view-amount") || 0.5;

    inView(
      container,
      (info) => {
        animate(info.target, { opacity: [0, 1] }, { duration: 2 });
      },
      { amount }
    );
  });
}

function initScrollTextRevealAnimations() {
  const allAnimations = Array.from(
    document.querySelectorAll("[data-page-animation-scroll-text-reveal]")
  );

  Array.from(allAnimations).map((text) => {
    const [splittedText] = Splitting({ target: text, by: "words" });
    const scrollContainerSelector = text.getAttribute("data-scroll-container");
    const container = scrollContainerSelector
      ? document.querySelector(scrollContainerSelector)
      : text;

    const singleWordThreshold = Math.round(100 / splittedText.words.length);
    const scrollThresholds = splittedText.words.map(
      (_, index) => index * singleWordThreshold
    );

    const onScrollUpdate = observe(scrollThresholds, (index) => {
      if (index > 0) {
        const matching = splittedText.words.slice(0, index + 1);
        animate(
          matching,
          {
            opacity: 1,
          },
          { duration: 1 }
        );
      }
    });

    scroll(
      ({ y }) => {
        const progressPercentage = Math.round(y.progress * 100);
        onScrollUpdate(progressPercentage);
      },
      {
        target: container,
        offset: ["start end", "end end"],
      }
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

function initImageAnimations() {
  const allAnimations = document.querySelectorAll(
    "[data-page-animation-visual]"
  );

  Array.from(allAnimations).map((container) => {
    const image = container.querySelector("img");
    const visualType = container.getAttribute("data-visual-type") || "image";
    const amount = container.getAttribute("data-in-view-amount") || 0.5;

    inView(
      container,
      (info) => {
        const animations = [
          [
            container,
            {
              opacity: 1,
            },
            { duration: 0.7, easing: EaseOutSmooth },
          ],
          [
            container,
            {
              clipPath: [
                "polygon(0% 8%, 100% 8%, 100% 100%, 0% 100%)",
                "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              ],
            },
            { duration: 1.2, easing: EaseOutSmooth, at: "-0.6" },
          ],
        ];

        if (visualType === "lazy-video") {
          const video = container.querySelectorAll("video");
          initLazyVideo(video[0]);
        } else {
          animations.push([
            image,
            {
              scale: [1.1, 1],
            },
            { easing: EaseOutSmooth, duration: 1.2, at: "-1.2" },
          ]);
        }

        timeline(animations);
      },
      { amount }
    );
  });
}

function initLazyVideo(videoElem) {
  for (const source in videoElem.children) {
    const videoSource = videoElem.children[source];
    if (
      typeof videoSource.tagName === "string" &&
      videoSource.tagName === "SOURCE"
    ) {
      videoSource.src = videoSource.dataset.src;
    }
  }

  videoElem.load();
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initPageAnimations();
  initScrollTextRevealAnimations();
  intiScrollProgressAnimations();
  initFadeInViewAnimations();
  initCustomClassAnimations();
  initImageAnimations();
});

/// HELPER
function observe(values, onMatching) {
  let unobserve = [];

  return (value) => {
    const isMatchingIndex = values.indexOf(value);

    if (
      value > values[values.length - 1] &&
      !unobserve.includes(values.length - 1)
    ) {
      onMatching(values.length - 1);
      unobserve = [...values.map((_, index) => index), values.length - 1];
    }

    if (~isMatchingIndex && !unobserve.includes(isMatchingIndex)) {
      onMatching(isMatchingIndex);
      unobserve = values.slice(0, isMatchingIndex + 1).map((_, index) => index);
    }
  };
}
