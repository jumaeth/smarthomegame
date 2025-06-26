export class RenderElement {
  id: string;
  scale: number;
  xCoordinate: number;
  yCoordinate: number;
  imagePath: string;
  boundingBoxX: number;
  boundingBoxY: number;

  constructor(id: string,
              scale: number,
              xCoordinate: number,
              yCoordinate: number,
              imagePath: string,
              boundingBoxX: number = 0,
              boundingBoxY: number = 0,
  ) {
    this.id = id;
    this.scale = scale;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.imagePath = imagePath;
    this.boundingBoxX = boundingBoxX;
    this.boundingBoxY = boundingBoxY;
  }
}
