document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector(".intro__video");
  const skipLink = document.querySelector("[href='#about']");

  skipLink.addEventListener("click", () => {
    window.scrollTo({
      top: window.innerHeight,
      left: 0,
      behavior: "smooth",
    });
  });

  video.classList.add("intro__video--with-fade");
  video.addEventListener("canplay", () =>
    video.classList.add("intro__video--loaded")
  );


});
