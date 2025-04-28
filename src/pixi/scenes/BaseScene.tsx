import { Container } from "pixi.js";

export abstract class BaseScene extends Container {
  abstract start(): void;
  abstract stop(): void;
}
