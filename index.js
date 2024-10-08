const track = document.getElementById("image-track");

track.dataset.percentage = "-50";
track.dataset.prevPercentage = "-50";

track.style.transform = `translate(-50%, -50%)`;

const handleOnDown = (e) => {
  track.dataset.mouseDownAt = e.clientX || e.touches[0].clientX;
  e.preventDefault();
};

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
};

const handleOnMove = (e) => {
  if (track.dataset.mouseDownAt === "0") return;

  const clientX = e.clientX || e.touches[0].clientX;
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - clientX,
    maxDelta = window.innerWidth / 2;

  const percentage = (mouseDelta / maxDelta) * -100,
    nextPercentageUnconstrained =
      parseFloat(track.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

  track.dataset.percentage = nextPercentage;

  track.style.transform = `translate(${nextPercentage}%, -50%)`;

  for (const image of track.getElementsByClassName("image")) {
    image.style.objectPosition = `${100 + nextPercentage}% center`;
  }
};

const handleOnScroll = (e) => {
  const scrollDelta = e.deltaY || e.wheelDelta;
  const maxDelta = window.innerWidth / 2;

  const percentage = (scrollDelta / maxDelta) * 15,
    nextPercentageUnconstrained =
      parseFloat(track.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

  track.dataset.percentage = nextPercentage;

  track.style.transform = `translate(${nextPercentage}%, -50%)`;

  for (const image of track.getElementsByClassName("image")) {
    image.style.objectPosition = `${100 + nextPercentage}% center`;
  }

  track.dataset.prevPercentage = nextPercentage;
};

window.onmousedown = (e) => handleOnDown(e);
window.onmouseup = (e) => handleOnUp(e);
window.onmousemove = (e) => handleOnMove(e);

window.addEventListener("touchstart", (e) => handleOnDown(e), {
  passive: false,
});
window.addEventListener("touchend", (e) => handleOnUp(e), { passive: false });
window.addEventListener(
  "touchmove",
  (e) => {
    handleOnMove(e);
    e.preventDefault();
  },
  { passive: false }
);

window.onwheel = (e) => handleOnScroll(e);
