import { Application } from "pixi.js";
import { SceneManager } from "./sceneManager";
import { MenuScene } from "./scenes/MenuScene";
import { GameScene } from "./scenes/GameScene";

export async function setupPixiApp() {
  const app = new Application({
    resizeTo: window,
    backgroundColor: 0x1099bb,
    antialias: true,
  });

  const sceneManager = new SceneManager(app);

  // Start with Menu
  const menuScene = new MenuScene();
  sceneManager.changeScene(menuScene);

  // Listen for click anywhere to switch to game
  app.view.addEventListener("click", () => {
    const gameScene = new GameScene();
    sceneManager.changeScene(gameScene);
  });

  return app;
}
