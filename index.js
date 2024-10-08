const track = document.getElementById("image-track");

// initial track state: a -50 offset on both values centers the track slider and the background images
// to create an optical illusion of looking out a window
track.dataset.percentage = "-50";
track.dataset.prevPercentage = "-50";

track.style.transform = `translate(-50%, -50%)`;

const handleOnDown = (e) => {
  track.dataset.mouseDownAt = e.clientX || e.touches[0].clientX; // handle both mouse and touch
  e.preventDefault();
};

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
};

const handleOnMove = (e) => {
  if (track.dataset.mouseDownAt === "0") return;

  const clientX = e.clientX || e.touches[0].clientX; // handle both mouse and touch
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - clientX,
    maxDelta = window.innerWidth / 2;

  const percentage = (mouseDelta / maxDelta) * -100,
    nextPercentageUnconstrained =
      parseFloat(track.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

  track.dataset.percentage = nextPercentage;

  track.animate(
    {
      transform: `translate(${nextPercentage}%, -50%)`,
    },
    { duration: 1200, fill: "forwards" }
  );

  for (const image of track.getElementsByClassName("image")) {
    image.animate(
      {
        objectPosition: `${100 + nextPercentage}% center`,
      },
      { duration: 1200, fill: "forwards" }
    );
  }
};

const handleOnScroll = (e) => {
  const scrollDelta = e.deltaY || e.wheelDelta;
  const maxDelta = window.innerWidth / 2;

  const percentage = (scrollDelta / maxDelta) * 25, // scroll sensitivity value
    nextPercentageUnconstrained =
      parseFloat(track.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

  track.dataset.percentage = nextPercentage;

  track.animate(
    {
      transform: `translate(${nextPercentage}%, -50%)`,
    },
    { duration: 1200, fill: "forwards" }
  );

  for (const image of track.getElementsByClassName("image")) {
    image.animate(
      {
        objectPosition: `${100 + nextPercentage}% center`,
      },
      { duration: 1200, fill: "forwards" }
    );
  }

  track.dataset.prevPercentage = nextPercentage;
};

// mouse events
window.onmousedown = (e) => handleOnDown(e);
window.onmouseup = (e) => handleOnUp(e);
window.onmousemove = (e) => handleOnMove(e);

// touch events with non-passive listener
window.addEventListener("touchstart", (e) => handleOnDown(e), {
  passive: false,
});
window.addEventListener("touchend", (e) => handleOnUp(e), { passive: false });
window.addEventListener(
  "touchmove",
  (e) => {
    handleOnMove(e);
    e.preventDefault(); // prevent scrolling while swiping
  },
  { passive: false }
);

// scroll event
window.onwheel = (e) => handleOnScroll(e);
