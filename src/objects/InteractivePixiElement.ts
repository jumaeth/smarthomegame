import {InteractiveType} from "@/types/InteractiveType.ts";
import { Container as PixiContainer } from "pixi.js";
export class InteractivePixiElement {
  constructor(
          public x: number,
          public y: number,
          public width: number,
          public height: number,
          public name: string,
          public interaction: () => React.ReactNode | void = () => {},
          public type: InteractiveType = InteractiveType.SMART_DEVICE
  ) {}
}