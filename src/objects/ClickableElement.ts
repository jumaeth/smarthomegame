import {RenderElement} from "./RenderElement.ts";

export class ClickableElement extends RenderElement{
  mouseOver: Filter;

  constructor(id: string,
              scale: number,
              xCoordinate: number,
              yCoordinate: number,
              imagePath: string,
              boundingBoxX: number = 0,
              boundingBoxY: number = 0,
              highlightFilter: Filter,
  ) {
    super(id, scale, xCoordinate, yCoordinate, imagePath, boundingBoxX, boundingBoxY);
    this.mouseOver = highlightFilter;
  }
}
