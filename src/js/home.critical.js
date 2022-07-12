document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector(".intro__video");

  video.classList.add("intro__video--with-fade");
  video.addEventListener("canplay", () =>
    video.classList.add("intro__video--loaded")
  );
});
