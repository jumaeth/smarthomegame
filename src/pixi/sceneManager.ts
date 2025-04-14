import { Application } from "pixi.js";
import { BaseScene } from "./scenes/BaseScene";

export class SceneManager {
  private app: Application;
  private currentScene?: BaseScene;

  constructor(app: Application) {
    this.app = app;
  }

  changeScene(newScene: BaseScene) {
    if (this.currentScene) {
      this.currentScene.stop();
      this.app.stage.removeChild(this.currentScene);
    }

    this.currentScene = newScene;
    this.currentScene.start();
    this.app.stage.addChild(this.currentScene);
  }
}
