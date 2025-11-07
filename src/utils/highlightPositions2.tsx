import {loadTexture} from "@/utils/loadTexture.ts";
import tv from "@/assets/highlighting/tv.png";
import lamp from "@/assets/highlighting/lamp.png";
import camera from "@/assets/highlighting/camera.png";
import hub from "@/assets/highlighting/hub.png";
import kitchen from "@/assets/highlighting/kitchen.png";
import {Sprite} from "@pixi/react";
import React from "react";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {Texture} from "@pixi/core";

export function getHighlightPosition2(name: String, position: {x, y}, windowWidth, windowHeight){

  switch (name){
    case "SmartTv":
      return (
              <>
                <Sprite
                        key={name + "highlight"}
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
                        key={name + "highlight"}
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
                        key={name + "highlight"}
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
                        key={name + "highlight"}
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
                        key={name + "highlight"}
                        x={position.x }
                        y={position.y + TILE_SIZE * 2.75}
                        texture={loadTexture(kitchen as String)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )
    default:
      return (
              <>
                <Sprite
                        key={"default highlight"}
                        x={0}
                        y={0}
                        texture={Texture.EMPTY}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )
  }
}