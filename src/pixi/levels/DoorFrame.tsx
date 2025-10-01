import {Sprite} from "@pixi/react";
import {GAME_HEIGHT, GAME_WIDTH, OFFSET_X, OFFSET_Y} from "@/pixi/constants/world-settings";
import {Texture} from "@pixi/core";
import {DoorState} from "@/types/door";
import {MapKey, Transition} from "@/types/maps.ts";
import {GameService} from "@/services/GameService.ts";

interface LevelProps {
  textures: Texture[] | undefined;
  map: MapKey;
  gameService: GameService;
  transition: Transition;
  index: number;
}

const stateToIndex = {
  [DoorState.Closed]: 0,
  [DoorState.HalfOpen]: 1,
  [DoorState.Open]: 2,
};

export const DoorFrame = ({ textures, map, gameService, transition, index}: LevelProps) => {
  if (!textures) return null;

  const state=gameService.getExitState(map, transition.to);
  const i=stateToIndex[state] + index * 3;

  return (
          <>
            <Sprite
                    texture={textures[i]}
                    width={GAME_WIDTH}
                    height={GAME_HEIGHT}
                    x={OFFSET_X}
                    y={OFFSET_Y}
                    scale={1.0}
            />
          </>
  )
};
