import { initStars, getStars, getStarsByDistanceAndPos } from './starService.js';

let gCanvasEl = null;
let gCtx = null;
const FRAMERATE = Math.floor(1000 / 16);
const STAR_COUNT = 100;
let STAR_DISTANCE_FROM_MOUSE;
let STAR_DISTANCE_FROM_STAR;
let gCurrMousePos = { x: 0, y: 0 }
let gIsMouseOverCanvas = false;
let gTouchPositions = null;
let gIsTouchStart = false;

window.addEventListener('load', init);

function init() {
  initGlobals();
  resizeCanvas();
  addEventListeners();
  initStars(STAR_COUNT, createCanvasDim());
  startRendering();
}
function addEventListeners() {
  gCanvasEl.addEventListener('mousemove', onMouseMoveHandler);
  gCanvasEl.addEventListener('mouseenter', (ev) => {
    gIsMouseOverCanvas = true;
  });
  gCanvasEl.addEventListener('mouseleave', (ev) => {
    gIsMouseOverCanvas = false;
  });
  gCanvasEl.addEventListener('touchstart', onTouchChangedHandler);
  gCanvasEl.addEventListener('touchmove', onTouchChangedHandler);
  gCanvasEl.addEventListener('touchend', onTouchEndHandler);
}

function onTouchChangedHandler(ev) {
  gTouchPositions = [];
  for (let i = 0; i < Array.from(ev.touches).length; i++) {
    const touchEvent = ev.touches[i];
    gTouchPositions.push({
      x: touchEvent.clientX - ev.target.offsetLeft,
      y: touchEvent.clientY - ev.target.offsetTop,
    })
    // alert('new touch position: ', gTouch)
  }
  ev.preventDefault();
}

function onTouchEndHandler() {
  gTouchPositions = null;
}


function onMouseMoveHandler(ev) {
  gCurrMousePos = {
    x: ev.offsetX,
    y: ev.offsetY,
  }
}

function initGlobals() {
  gCanvasEl = document.getElementById('canvas');
  gCtx = gCanvasEl.getContext('2d');
}
function resizeCanvas() {
  const ccEl = document.querySelector('.canvas-container');
  gCanvasEl.width = ccEl.offsetWidth;
  gCanvasEl.height = ccEl.offsetHeight;

  STAR_DISTANCE_FROM_MOUSE = ccEl.offsetWidth / 5;
  STAR_DISTANCE_FROM_STAR = ccEl.offsetHeight / 5;
}

function createCanvasDim() {
  return {
    height: gCanvasEl.height,
    width: gCanvasEl.width
  }
}

function startRendering() {
  setInterval(() => {
    clearCanvas();
    renderStars();
    if (gIsMouseOverCanvas || gTouchPositions) renderStarLines();
  }, FRAMERATE);
}
function clearCanvas() {
  const { width, height } = gCanvasEl;
  gCtx.fillStyle = "rgb(0,0,0)";
  gCtx.fillRect(0, 0, width, height);
}

function renderStarLines() {
  if (gTouchPositions) {
    gTouchPositions.forEach(touchPosition => {
      debugger;
      const starsAroundTouch = getStarsByDistanceAndPos(STAR_DISTANCE_FROM_MOUSE, touchPosition);
      starsAroundTouch.forEach(starA => {
        starsAroundTouch.forEach(starB => {
          drawLineBetweenStars(starA, starB);
        });
      });
    });
  } else {
    const starsAroundMouse = getStarsByDistanceAndPos(STAR_DISTANCE_FROM_MOUSE, gCurrMousePos);
    starsAroundMouse.forEach(starA => {
      starsAroundMouse.forEach(starB => {
        drawLineBetweenStars(starA, starB);
      });
    });
  }
}
function drawLineBetweenStars(star1, star2) {
  const starsDistance = star1.distance(star2.pos);
  if (starsDistance > STAR_DISTANCE_FROM_STAR) return;
  const { pos: pos1 } = star1;
  const { pos: pos2 } = star2;
  var gradient = gCtx.createLinearGradient(pos1.x, pos1.y, pos2.x, pos2.y);
  gradient.addColorStop(0, star1.color);
  gradient.addColorStop(1, star2.color);
  gCtx.strokeStyle = gradient;
  gCtx.beginPath();
  gCtx.moveTo(pos1.x, pos1.y);
  gCtx.lineTo(pos2.x, pos2.y);
  gCtx.stroke();

  // some canvas logic for drawing, using both stars' colors!
}
function renderStars() {
  const stars = getStars()
  stars.forEach(star => {
    renderStar(star);
    star.movePos();
  });
}

function renderStar(star) {
  gCtx.beginPath();
  gCtx.fillStyle = star.color;
  gCtx.strokeStyle = star.color;
  const pos = star.pos;
  gCtx.arc(pos.x, pos.y, star.radius, 0, Math.PI * 2);
  gCtx.fill();
  gCtx.stroke();
}