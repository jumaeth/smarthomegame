import {Sprite} from "@pixi/react";
import {GAME_HEIGHT, GAME_WIDTH, OFFSET_X, OFFSET_Y} from "@/pixi/constants/world-settings";
import {Texture} from "@pixi/core";
import {DoorState} from "@/types/door";
import {MapKey, Transition} from "@/types/maps.ts";
import {GameService} from "@/services/GameService.ts";

interface LevelProps {
  textures: Texture[];
  map: MapKey;
  gameService: GameService;
  transition: Transition;
}

const stateToIndex = {
  [DoorState.Closed]: 0,
  [DoorState.HalfOpen]: 1,
  [DoorState.Open]: 2,
};

export const DoorFrame = ({ textures, map, gameService, transition}: LevelProps) => {
  if (!textures) return null;

  const state=gameService.getExitState(map, transition.to);
  const texture = textures[stateToIndex[state]];
  if (!texture) return null;

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
};
