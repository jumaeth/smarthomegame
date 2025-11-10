import {loadTexture} from "@/utils/loadTexture.ts";
import tv from "@/assets/highlighting/tv.png";
import lamp from "@/assets/highlighting/lamp.png";
import camera from "@/assets/highlighting/camera.png";
import hub from "@/assets/highlighting/hub.png";
import kitchen from "@/assets/highlighting/kitchen.png";
import mirror from "@/assets/highlighting/mirror.png";
import hallway_frog from "@/assets/highlighting/extras/hallway_frog.png";
import {Container, Graphics, Sprite} from "@pixi/react";
import React from "react";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";

export function getHighlightPosition2(device: InteractivePixiElement, position: {x, y}){

  switch (device.name){
    case "SmartTv":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x + TILE_SIZE * 4.8}
                        y={position.y + TILE_SIZE * 3.8}
                        texture={loadTexture(tv as String)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )
    case "SmartLights":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x + TILE_SIZE * 7.975}
                        y={position.y + TILE_SIZE * 3.5}
                        texture={loadTexture(lamp as String)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )
    case "SecurityCamera":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x + TILE_SIZE * 8.04}
                        y={position.y + TILE_SIZE * 4}
                        texture={loadTexture(camera as String)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )
    case "SmartHomeHub":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x - TILE_SIZE * 4.96}
                        y={position.y + TILE_SIZE}
                        texture={loadTexture(hub as String)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )
    case "SmartKitchen":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x }
                        y={position.y + TILE_SIZE * 2.75}
                        texture={loadTexture(kitchen as String)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )
    case "SmartMirror":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x - TILE_SIZE * 2}
                        y={position.y + TILE_SIZE * 3.75}
                        texture={loadTexture(mirror as String)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    //--extras--

    case "HallwayFrog":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x - TILE_SIZE * 2}
                        y={position.y + TILE_SIZE * 3.75}
                        texture={loadTexture(hallway_frog as String)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )



    default:
      return (
              <Container>
                <Graphics
                        draw={(g) => {
                          g.clear();
                          g.lineStyle(1, 0xFFFF00, 0.5);
                          g.drawRoundedRect(
                                  device.x * TILE_SIZE,
                                  device.y * TILE_SIZE,
                                  device.width * TILE_SIZE,
                                  device.height * TILE_SIZE,
                                  1
                          );
                          g.endFill();
                        }}
                />
              </Container>
      )
  }
}