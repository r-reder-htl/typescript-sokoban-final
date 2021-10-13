import p5 = require('p5');
import { p } from './index';

export enum PlayerDirection {
  Left,
  Top,
  Right,
  Bottom
}

const imageNames = [
  "https://cddataexchange.blob.core.windows.net/data-exchange/sokoban/Player/player_14.png",
  "https://cddataexchange.blob.core.windows.net/data-exchange/sokoban/Player/player_02.png",
  "https://cddataexchange.blob.core.windows.net/data-exchange/sokoban/Player/player_17.png",
  "https://cddataexchange.blob.core.windows.net/data-exchange/sokoban/Player/player_05.png"
];

let currentDirection = PlayerDirection.Bottom;

export let images: p5.Image[] = [];

export function preload() {
  for (const i of imageNames) {
    images.push(p.loadImage(i));
  }
}

export function image() {
  return images[currentDirection];
}

export function setDirection(direction: PlayerDirection) {
  currentDirection = direction;
}
