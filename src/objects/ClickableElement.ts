import {RenderElement} from "./RenderElement.ts";
import {Filter} from "pixi.js";

export class ClickableElement extends RenderElement{
  mouseOver: Filter;
  onclick: Function;

  constructor(id: string,
              scale: number,
              xCoordinate: number,
              yCoordinate: number,
              imagePath: string,
              boundingBoxX: number = 0,
              boundingBoxY: number = 0,
              highlightFilter: Filter,
              action: Function,
  ) {
    super(id, scale, xCoordinate, yCoordinate, imagePath, boundingBoxX, boundingBoxY);
    this.mouseOver = highlightFilter;
    this.onclick = action;
  }
}
