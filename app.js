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
  if (document.hidden || state !== "open") return;
  video.play().catch(() => {
    // The poster stays visible if a device blocks autoplay or video cannot load.
    scene.classList.remove("is-playing");
  });
}

function showInvitation() {
  clearTimeout(openingTimer);
  setState("open");
  cover.hidden = true;
  invitation.hidden = false;
  invitation.inert = false;
  openButton.setAttribute("aria-expanded", "true");
  motionStatus.textContent = "دعوت‌نامه باز شد؛ چهارشنبه ۲۲ مهر، ساعت ۱۸:۳۰ الی ۲۲:۳۰، عمارت تاریخی صدراعظم.";
  window.scrollTo({ top: 0, behavior: "instant" });
  coupleTitle.focus({ preventScroll: true });
  playIllustration();
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
  openingTimer = window.setTimeout(showInvitation, 3100);
}

openButton.addEventListener("click", openInvitation);

video.addEventListener("playing", () => scene.classList.add("is-playing"));
video.addEventListener("error", () => scene.classList.remove("is-playing"));
if (!video.paused && video.readyState >= 2) scene.classList.add("is-playing");

reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) {
    if (state === "opening") showInvitation();
  }
  playIllustration();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) video.pause();
  else playIllustration();
});
