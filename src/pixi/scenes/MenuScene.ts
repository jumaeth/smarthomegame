import { BaseScene } from "./BaseScene";
import { Graphics, Text } from "pixi.js";

export class MenuScene extends BaseScene {
  constructor() {
    super();
  }

  start() {
    // Create a simple background
    const bg = new Graphics();
    bg.beginFill(0x333333);
    bg.drawRect(0, 0, window.innerWidth, window.innerHeight);
    bg.endFill();
    this.addChild(bg);

    // Add some text
    const text = new Text("MENU - Click to Start", {
      fill: "white",
      fontSize: 36,
    });
    text.anchor.set(0.5);
    text.x = window.innerWidth / 2;
    text.y = window.innerHeight / 2;
    this.addChild(text);
  }

  stop() {
    this.removeChildren();
  }
}
