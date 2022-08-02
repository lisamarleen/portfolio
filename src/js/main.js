import { animate, scroll, stagger, timeline } from "motion";
import Splitting from "splitting";

const EaseLinear = "cubic-bezier(0.25,0.25,0.75,0.75)";
const EaseInSine = "cubic-bezier(0.47,0,0.745,0.715)";
const EaseoutSine = "cubic-bezier(0.39,0.575,0.565,1)";
const EaseinOutSine = "cubic-bezier(0.445,0.05,0.55,0.95)";
const EaseinQuad = "cubic-bezier(0.55,0.085,0.68,0.53)";
const EaseoutQuad = "cubic-bezier(0.25,0.46,0.45,0.94)";
const EaseinOutQuad = "cubic-bezier(0.455,0.03,0.515,0.955)";
const EaseinCubic = "cubic-bezier(0.55,0.055,0.675,0.19)";
const EaseoutCubic = "cubic-bezier(0.215,0.61,0.355,1)";
const EaseinOutCubic = "cubic-bezier(0.645,0.045,0.355,1)";
const EaseinQuart = "cubic-bezier(0.895,0.03,0.685,0.22)";
const EaseoutQuart = "cubic-bezier(0.165,0.84,0.44,1)";
const EaseinOutQuart = "cubic-bezier(0.77,0,0.175,1)";
const EaseinQuint = "cubic-bezier(0.755,0.05,0.855,0.06)";
const EaseoutQuint = "cubic-bezier(0.23,1,0.32,1)";
const EaseinOutQuint = "cubic-bezier(0.86,0,0.07,1)";
const EaseinExpo = "cubic-bezier(0.95,0.05,0.795,0.035)";
const EaseoutExpo = "cubic-bezier(0.19,1,0.22,1)";
const EaseinOutExpo = "cubic-bezier(1,0,0,1)";
const EaseinCirc = "cubic-bezier(0.6,0.04,0.98,0.335)";
const EaseoutCirc = "cubic-bezier(0.075,0.82,0.165,1)";
const EaseinOutCirc = "cubic-bezier(0.785,0.135,0.15,0.86)";
const EaseinBack = "cubic-bezier(0.6,-0.28,0.735,0.045)";
const EaseoutBack = "cubic-bezier(0.25,2,0.5,0.9)";
const EaseinOutBack = "cubic-bezier(0.68,-0.55,0.265,1.55)";

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

function getRandomSub(arr, size = 3) {
  const shuffled = arr.slice(0);
  let i = arr.length,
    temp,
    index;

  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}

document.addEventListener("DOMContentLoaded", () => {
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
      { opacity: [0, 1], y: [16, 0] },
      { easing: EaseoutCubic, at: "-0.75" },
    ]);
  }

  timeline(sequence).finished.then(() => {
    let initialOffsetAnimation = false;
    const randomChars = getRandomSub(chars, Math.round(chars.length / 3));

    scroll(
      ({ y }) => {
        if (!initialOffsetAnimation) {
          animate(randomChars, {
            y: [0, `${y.progress * 100}%`],
            easing: EaseinOutBack,
          });

          initialOffsetAnimation = true;
        }

        animate(randomChars, {
          y: `${y.progress * 100}%`,
        });
      },

      {
        target: container,
        offset: ["end end", "end start"],
      }
    );
  });

  if (background) {
    scroll(animate(background, { opacity: [0, 1, 1, 0] }), {
      target: container,
      offset: ["start start", "end end", "start start", "end start"],
    });
  }
});
