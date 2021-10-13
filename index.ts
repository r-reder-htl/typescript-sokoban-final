import "./style.css";
import p5 = require('p5');

import { GetBlockImageBySymbol, preload as blockPreload } from "./block";
import { preload as playerPreload, image as playerImage, setDirection, PlayerDirection } from "./player";
import { replaceChar } from "./strings";
import { getLevel, getNumberOfLevels } from "./levels";
import { achievement,  backgroundMusic,  preload as soundPreload,  slide } from "./sounds";
import { preload as iconsPreload, IconType } from "./icons";
import { Button } from "./button";

let level: string[];
let player: { x: number; y: number };
let win = false;
let levelNumber = 0;
const levelDisplay = document.getElementById("level") as HTMLSpanElement;
let moves = 0;
const movesDisplay = document.getElementById("moves") as HTMLSpanElement;

let muted = true;
let muteButton: Button;
let unmuteButton: Button;
let restartButton: Button;

const cellSize = 64;

export let p: p5;
new p5((p5: p5) => {
  p = p5;
  p.preload = preload;
  p.setup = setup;
  p.draw = draw;
  p.keyPressed = keyPressed;
  p.mouseClicked = mouseClicked;
});

function preload() {
  blockPreload();
  playerPreload();
  soundPreload();
  iconsPreload();

  restartButton = new Button(IconType.Restart, cellSize, 0, 0);

  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.2;
  if (!muted) backgroundMusic.play();
}

function setup() {
  level = getLevel(levelNumber);
  levelDisplay.innerText = (levelNumber + 1).toString();

  player = findPlayer();

  muteButton = new Button(IconType.Mute, cellSize, 0, level.length - 1);
  unmuteButton = new Button(IconType.Volume, cellSize, 0, level.length - 1);

  const canvas = p.createCanvas(
    level[0].length * cellSize,
    level.length * cellSize
  );
  canvas.parent("sketch-holder");
}

function findPlayer(): { x: number; y: number } {
  let y = 0;
  for (const line of level) {
    let x = 0;
    for (const cell of line) {
      if (cell === "@") {
        level[y] = replaceChar(level[y], " ", x);
        return { x, y };
      }

      x++;
    }

    y++;
  }
}

function draw() {
  let y = 0;
  for (const line of level) {
    let x = 0;
    for (const cell of line) {
      if (cell !== "_") {
        const image = GetBlockImageBySymbol(cell);
        p.image(image, x * cellSize, y * cellSize, cellSize, cellSize);
      } else {
        p.fill("white");
        p.noStroke();
        p.rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }

      x++;
    }

    y++;
  }

  p.image(
    playerImage(),
    player.x * cellSize,
    player.y * cellSize,
    cellSize,
    cellSize
  );

  if (muteButton && unmuteButton) {
    if (muted) muteButton.draw();
    else unmuteButton.draw();
  }

  if (restartButton) restartButton.draw();

  if (win) {
    p.fill(200, 200, 200, 200);
    p.rect(
      p.width / 5,
      (p.height / 9) * 2,
      (p.width / 5) * 3,
      (p.height / 9) * 5
    );

    p.textSize(35);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill("darkred");
    p.stroke("yellow");
    p.text("Completed in", p.width / 2, p.height / 2 - 45);
    p.text(`${moves} moves 👍`, p.width / 2, p.height / 2 - 5);
    p.noStroke();

    p.textSize(20);
    if (levelNumber + 1 < getNumberOfLevels()) {
      p.text("Press any key to continue", p.width / 2, p.height / 2 + 45);
    } else {
      p.text("You completed all levels 🥳!", p.width / 2, p.height / 2 + 45);
    }
  }
}

function keyPressed() {
  if (win) {
    if (levelNumber + 1 < getNumberOfLevels()) {
      win = false;
      levelNumber++;
      setup();
    }

    return;
  }

  const movement = { x: 0, y: 0 };

  moves++;
  movesDisplay.innerText = moves.toString();

  if (p.keyIsDown(p.LEFT_ARROW)) {
    movement.x--;
    setDirection(PlayerDirection.Left);
  }
  else if (p.keyIsDown(p.RIGHT_ARROW))
  {
    movement.x++;
    setDirection(PlayerDirection.Right);
  }
  else if (p.keyIsDown(p.DOWN_ARROW)) {
    movement.y++;
    setDirection(PlayerDirection.Bottom);
  }
  else if (p.keyIsDown(p.UP_ARROW)) {
    movement.y--;
    setDirection(PlayerDirection.Top);
  } 

  const target = { x: player.x + movement.x, y: player.y + movement.y };
  const targetBlock = level[target.y][target.x];
  if (targetBlock === "X") return;
  if (targetBlock === "b" || targetBlock === "B") {
    const nextAfterTarget = {
      x: target.x + movement.x,
      y: target.y + movement.y
    };
    const nextBlockAfterTarget = level[nextAfterTarget.y][nextAfterTarget.x];
    if (nextBlockAfterTarget !== " " && nextBlockAfterTarget !== ".") return;
    let targetBox: string;

    let achievementPlayed = false;
    if (nextBlockAfterTarget === " ") {
      targetBox = "b";
    } else if (nextBlockAfterTarget === ".") {
      achievement.play();
      achievementPlayed = true;
      targetBox = "B";
    }

    level[nextAfterTarget.y] = replaceChar(
      level[nextAfterTarget.y],
      targetBox,
      nextAfterTarget.x
    );

    if (targetBlock === "B") {
      targetBox = ".";
    } else {
      targetBox = " ";
    }

    if (!achievementPlayed) slide.play();
    level[target.y] = replaceChar(level[target.y], targetBox, target.x);
  }

  player.x += movement.x;
  player.y += movement.y;

  win = checkWin();
}

function checkWin(): boolean {
  for (const line of level) {
    for (const cell of line) {
      if (cell === "b") return false;
    }
  }

  return true;
}

function mouseClicked() {
  if (muteButton.isInside(p.mouseX, p.mouseY)) {
    muted = !muted;
    if (muted) backgroundMusic.pause();
    else backgroundMusic.play();
  }

  if (restartButton.isInside(p.mouseX, p.mouseY)) {
    win = false;
    moves = 0;
    movesDisplay.innerText = moves.toString();
    setup();
  }
}
