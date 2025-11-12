import {Sprite} from "@pixi/react";
import {OFFSET_X, OFFSET_Y} from "@/pixi/constants/world-settings";
import {Texture} from "@pixi/core";

interface LevelProps {
  pixelSize: {
    width: number;
    height: number
  };
  texture: Texture;
}

export const Level = ({pixelSize, texture}: LevelProps) => {
  return (
          <>
            <Sprite
                    texture={texture}
                    width={pixelSize.width}
                    height={pixelSize.height}
                    x={OFFSET_X}
                    y={OFFSET_Y}
                    scale={1.0}
            />
          </>
  )
}