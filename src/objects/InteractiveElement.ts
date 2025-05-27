import {RenderElement} from "./RenderElement";

export class InteractiveElement extends RenderElement {
  constructor(
          id: string,
          scale: number,
          xCoordinate: number,
          yCoordinate: number,
          imagePath: string,
          boundingBoxX: number = 0,
          boundingBoxY: number = 0,
          public callback: () => void // Callback-Funktion
  ) {
    super(id, scale, xCoordinate, yCoordinate, imagePath, boundingBoxX, boundingBoxY);
  }
}
