import {Sprite} from "@pixi/react";
import {GAME_HEIGHT, GAME_WIDTH, OFFSET_X, OFFSET_Y} from "@/pixi/constants/world-settings";
import {Texture} from "@pixi/core";
import {DoorState} from "@/types/door";

interface LevelProps {
  textures: Texture[] | undefined;
  state: DoorState;
  doorOfRoom: number;
}

const stateToIndex = {
  [DoorState.Closed]: 0,
  [DoorState.HalfOpen]: 1,
  [DoorState.Open]: 2,
};

export const Door = ({textures, state, doorOfRoom}: LevelProps) => {
  if (!textures) return;

  const index = stateToIndex[state]+((doorOfRoom)*3);
  const texture = textures[index];

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