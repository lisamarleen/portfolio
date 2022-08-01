import { animate, scroll, stagger } from "motion";
import Splitting from "splitting";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".page-intro");
  const background = document.querySelector(".page-intro__background");
  const title = document.querySelector(".page-intro__title");

  const { chars } = Splitting({ target: title, by: "chars" })[0];

  animate(
    title,
    { scale: [1.1, 1] },
    { duration: 2, easing: "cubic-bezier(0.455,0.03,0.515,0.955)" }
  );

  animate(
    chars,
    { opacity: [0, 1], filter: ["blur(2px)", "blur(0)"] },
    {
      duration: 2,
      delay: stagger(0.05, {
        easing: "cubic-bezier(0.55,0.085,0.68,0.53)",
      }),
    }
  );

  if (background) {
    scroll(animate(background, { opacity: [0, 1, 1, 0] }), {
      target: container,
      offset: ["start start", "end end", "start start", "end start"],
    });
  }
});
