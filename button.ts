import p5 = require('p5');
import { p } from './index';
import { getIcon, IconType } from "./icons";

export class Button {
  private iconSize: number;
  private iconPosition: { x: number; y: number };
  constructor(
    private iconType: IconType,
    private cellSize: number,
    private x: number,
    private y: number
  ) {
    this.iconSize = cellSize / 3;
    this.iconPosition = {
      x: x * cellSize + this.iconSize,
      y: y * cellSize + cellSize / 3
    };
  }

  draw() {
    p.image(
      getIcon(this.iconType),
      this.iconPosition.x,
      this.iconPosition.y,
      this.iconSize,
      this.iconSize
    );
  }

  isInside(x: number, y: number) {
    return (
      x >= this.iconPosition.x &&
      x <= this.iconPosition.x + this.iconSize &&
      y >= this.iconPosition.y &&
      y <= this.iconPosition.y + this.iconSize
    );
  }
}
