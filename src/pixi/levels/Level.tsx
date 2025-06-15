import {Sprite} from "@pixi/react";
import {GAME_HEIGHT, GAME_WIDTH, OFFSET_X, OFFSET_Y} from "@/pixi/constants/world-settings";
import {Texture} from "@pixi/core";

interface LevelProps {
  texture: Texture;
}

export const Level = ({texture}: LevelProps) => {
  return (
          <>
            <Sprite
                    texture={texture}
                    width={GAME_WIDTH}
                    height={GAME_HEIGHT}
                    x={OFFSET_X}
                    y={OFFSET_Y}
                    scale={1.0}
            />
          </>
  )
}