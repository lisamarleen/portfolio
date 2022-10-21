document.documentElement.classList.remove("no-js");

document.addEventListener("DOMContentLoaded", () => {
  const tabbed = document.querySelector(".tabs");

  if (tabbed) {
    initTab();
  }
});

// based on https://inclusive-components.design/tabbed-interfaces/
function initTab() {
  const tabbed = document.querySelector(".tabs");
  const tablist = tabbed.querySelector("ul");
  const tabs = tablist.querySelectorAll("a");
  const panels = tabbed.querySelectorAll(".tabs-panel");
  const selectedTabIndex = window.location.hash
    ? Array.from(tabs).findIndex(
        (tab) => tab.getAttribute("href") === window.location.hash
      )
    : 0;

  const switchTab = (oldTab, newTab) => {
    newTab.focus();
    newTab.removeAttribute("tabindex");
    newTab.setAttribute("aria-selected", "true");

    oldTab.removeAttribute("aria-selected");
    oldTab.setAttribute("tabindex", "-1");

    let index = Array.prototype.indexOf.call(tabs, newTab);
    let oldIndex = Array.prototype.indexOf.call(tabs, oldTab);
    panels[oldIndex].hidden = true;
    panels[index].hidden = false;

    window.scrollTo({
      top: newTab.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  window.addEventListener("hashchange", (e) => {
    e.preventDefault();

    let currentTab = tablist.querySelector("[aria-selected]");
    let newTab = tablist.querySelector("[tabindex]");

    if (newTab !== currentTab) {
      switchTab(currentTab, newTab);
    }
  });

  tablist.setAttribute("role", "tablist");

  Array.prototype.forEach.call(tabs, (tab, i) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("id", "tab" + (i + 1));
    tab.setAttribute("tabindex", "-1");
    tab.parentNode.setAttribute("role", "presentation");

    tab.addEventListener("click", (e) => {
      e.preventDefault();
      let currentTab = tablist.querySelector("[aria-selected]");
      if (e.currentTarget !== currentTab) {
        window.location.hash = e.currentTarget.getAttribute("href");
      }
    });

    tab.addEventListener("keydown", (e) => {
      let index = Array.prototype.indexOf.call(tabs, e.currentTarget);
      let dir =
        e.which === 37
          ? index - 1
          : e.which === 39
          ? index + 1
          : e.which === 40
          ? "down"
          : null;
      if (dir !== null) {
        e.preventDefault();
        dir === "down"
          ? panels[i].focus()
          : tabs[dir]
          ? switchTab(e.currentTarget, tabs[dir])
          : void 0;
      }
    });
  });

  Array.prototype.forEach.call(panels, (panel, i) => {
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("tabindex", "-1");
    let id = panel.getAttribute("id");
    panel.setAttribute("aria-labelledby", tabs[i].id);
    panel.hidden = true;
  });

  tabs[selectedTabIndex].removeAttribute("tabindex");
  tabs[selectedTabIndex].setAttribute("aria-selected", "true");
  panels[selectedTabIndex].hidden = false;
}
