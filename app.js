"use strict";

const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const openButton = document.getElementById("open-invitation");
const coupleTitle = document.getElementById("couple-title");
const video = document.getElementById("couple-motion");
const scene = document.querySelector(".couple-scene");
const motionStatus = document.getElementById("motion-status");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let openingTimer;
let revealTimer;
let state = "closed";

cover.hidden = false;
invitation.hidden = true;
invitation.inert = true;
document.documentElement.classList.add("js");

function setState(nextState) {
  state = nextState;
  document.body.dataset.state = nextState;
}

function playIllustration() {
  if (document.hidden || (state !== "open" && state !== "revealing")) return;
  video.play().catch(() => {
    // The poster stays visible if a device blocks autoplay or video cannot load.
    scene.classList.remove("is-playing");
  });
}

function finishOpening() {
  clearTimeout(openingTimer);
  clearTimeout(revealTimer);
  setState("open");
  cover.hidden = true;
  openButton.setAttribute("aria-expanded", "true");
  motionStatus.textContent = "دعوت‌نامه باز شد؛ چهارشنبه ۲۲ مهر، ساعت ۱۸:۳۰ الی ۲۲:۳۰، عمارت تاریخی صدراعظم.";
  coupleTitle.focus({ preventScroll: true });
  playIllustration();
}

function motionDuration(property, fallback) {
  const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(property));
  return Number.isFinite(value) ? value : fallback;
}

function showInvitation() {
  if (state === "open" || state === "revealing") return;
  clearTimeout(openingTimer);
  cover.inert = true;
  cover.setAttribute("aria-hidden", "true");
  invitation.hidden = false;
  invitation.inert = false;
  window.scrollTo({ top: 0, behavior: "instant" });
  setState("revealing");
  playIllustration();
  if (reducedMotion.matches) {
    finishOpening();
    return;
  }
  // Keep both layers present during the crossfade, then retire the cover.
  revealTimer = window.setTimeout(finishOpening, motionDuration("--invitation-reveal-duration", 1800) + 150);
}

function openInvitation() {
  if (state !== "closed") return;
  openButton.disabled = true;
  openButton.setAttribute("aria-expanded", "true");
  if (reducedMotion.matches) {
    showInvitation();
    return;
  }
  setState("opening");
  motionStatus.textContent = "در حال باز شدن دعوت‌نامه";
  openingTimer = window.setTimeout(showInvitation, motionDuration("--envelope-opening-duration", 4100));
}

openButton.addEventListener("click", openInvitation);
invitation.addEventListener("animationend", (event) => {
  if (event.target === invitation && event.animationName === "invitation-reveal" && state === "revealing") finishOpening();
});

video.addEventListener("playing", () => scene.classList.add("is-playing"));
video.addEventListener("error", () => scene.classList.remove("is-playing"));
if (!video.paused && video.readyState >= 2) scene.classList.add("is-playing");

reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) {
    if (state === "opening") showInvitation();
    else if (state === "revealing") finishOpening();
  }
  playIllustration();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) video.pause();
  else playIllustration();
});
