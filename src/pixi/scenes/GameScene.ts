import { BaseScene } from "./BaseScene";
import { Sprite, Assets } from "pixi.js";

export class GameScene extends BaseScene {
  private bunny?: Sprite;

  async start() {
    const texture = await Assets.load("https://pixijs.io/examples/examples/assets/bunny.png");
    this.bunny = new Sprite(texture);
    this.bunny.anchor.set(0.5);
    this.bunny.x = window.innerWidth / 2;
    this.bunny.y = window.innerHeight / 2;
    this.addChild(this.bunny);
  }

  stop() {
    this.removeChildren();
  }
}
