"use strict";
//---------------------------------------------->
//SECTION: Variable and constant
const animationPerSecond = 10;
const offlineLimitSec = 1;
//---------------------------------------------->

//---------------------------------------------->
//SECTION: function
const getAngle = (height, base) => {
  const angle = Math.atan(height / base) * (180 / Math.PI);
  return base >= 0 ? angle : angle - 180;
};
const joinValidation = (id) => {
  const tab = localStorage.getItem(`user-${id}`);
  const currTime = new Date() * 1;
  if (tab == null) return true;
  return currTime - JSON.parse(tab).time >= offlineLimitSec * 1000;
};
const fetchLocInfo = () => {
  let xPosWin = window.screenX || window.screenLeft;
  let yPosWin = window.screenY || window.screenTop;
  let innerWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  let innerHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  return [xPosWin + innerWidth / 2, yPosWin + innerHeight / 2];
};
const setData = (x, y, time) => {
  const { width, height } = getComputedStyle(arrowYou);
  localStorage.setItem(
    `user-${id}`,
    JSON.stringify({
      x,
      y,
      time,
      width,
      height,
    })
  );
};
const missingOpponenet = () => {
  arrowYou.style.opacity = 0.5;
  arrowOpponent.style.left = "";
};
const update = (myX, myY, opX, opY, width, height) => {
  let x_diff = opX - myX;
  let y_diff = opY - myY;
  arrowYou.style.transform = `rotate(${getAngle(y_diff, x_diff)}deg)`;
  arrowOpponent.style.transform = `rotate(${getAngle(-y_diff, -x_diff)}deg)`;

  arrowOpponent.style.width = width;
  arrowOpponent.style.height = height;
  width = width.slice(0, -2) * 0.5;
  height = height.slice(0, -2) * 0.5;

  arrowOpponent.style.top = `calc(${
    window.innerHeight / 2 + y_diff
  }px - ${width}px)`;
  arrowOpponent.style.left = `calc(${
    window.innerWidth / 2 + x_diff
  }px - ${height}px)`;
};
//update(myLocation, [opponentInfo.x, opponentInfo.y]);
//---------------------------------------------->

//---------------------------------------------->
//SECTION: init
let id, arrowYou, arrowOpponent;
if (joinValidation(0)) {
  id = 0;
} else if (joinValidation(1)) {
  id = 1;
} else {
  document.querySelector("*").style.display = "none";
  alert("Third party not allowed");
  throw new Error("Third party not allowed");
}
if (id == 0) {
  arrowYou = document.querySelector(".arrow.red");
  arrowOpponent = document.querySelector(".arrow.yellow");
} else {
  arrowYou = document.querySelector(".arrow.yellow");
  arrowOpponent = document.querySelector(".arrow.red");
}
arrowYou.classList.add("you");
arrowOpponent.classList.add("opponent");
setData(...fetchLocInfo(), new Date() * 1);
//---------------------------------------------->

//---------------------------------------------->
//SECTION: engine
const engine = (myLocation, currTime) => {
  const opponent = localStorage.getItem(`user-${id ^ 1}`);
  if (opponent) {
    arrowYou.style.opacity = 1;
    const opponentInfo = JSON.parse(opponent);
    if (Math.abs(opponentInfo.time - currTime) / 1000 <= offlineLimitSec) {
      update(
        ...myLocation,
        opponentInfo.x,
        opponentInfo.y,
        opponentInfo.width,
        opponentInfo.height
      );
    } else missingOpponenet();
  } else missingOpponenet();
};
//---------------------------------------------->

//---------------------------------------------->
//SECTION: annimation
let lastTimeMainRun = 0;
const main = (ctime) => {
  if (ctime - lastTimeMainRun >= 1000 / animationPerSecond) {
    lastTimeMainRun = ctime;
    const myLocation = fetchLocInfo();
    const currTime = new Date() * 1;
    setData(...myLocation, currTime);
    engine(myLocation, currTime);
  }
  window.requestAnimationFrame(main);
};
window.requestAnimationFrame(main);
//---------------------------------------------->
