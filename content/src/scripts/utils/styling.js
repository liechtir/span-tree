export const applyOpenedPageStyling = (width) => {
  document.querySelector("header").style.left = width + "px";
  document.querySelector(".nav-sidebar").style.left = width + "px";
  document.querySelector("body").style.marginLeft = width + "px";
  document.querySelector("body").style.overflowX = "auto";
};

export const applyClosedPageStyling = () => {
  document.querySelector("header").style.left = "0";
  document.querySelector(".nav-sidebar").style.left = "0";
  document.querySelector("body").style.marginLeft = "0";
};
