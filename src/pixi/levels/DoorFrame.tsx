import {Sprite} from "@pixi/react";
import {GAME_HEIGHT, GAME_WIDTH, OFFSET_X, OFFSET_Y} from "@/pixi/constants/world-settings";
import {Texture} from "@pixi/core";
import {DoorState} from "@/types/door";
import {getTransitionsForMap} from "@/utils/mapTransition.ts";
import {MapKey} from "@/types/maps.ts";
import {GameService} from "@/services/GameService.ts";

interface LevelProps {
  textures: Texture[] | undefined;
  map: MapKey;
  gameService: GameService;
}

const stateToIndex = {
  [DoorState.Closed]: 0,
  [DoorState.HalfOpen]: 1,
  [DoorState.Open]: 2,
};

export const DoorFrame = ({ textures, map, gameService }: LevelProps) => {
  if (!textures) return null;

  return (
          <>
            {getTransitionsForMap(map).map((tr, i) => {
              const state = gameService.getExitState(map, tr.to);
              const index = stateToIndex[state] + i * 3;
              return (
                      <Sprite
                              key={`frame-${i}`}
                              texture={textures[index]}
                              width={GAME_WIDTH}
                              height={GAME_HEIGHT}
                              x={OFFSET_X}
                              y={OFFSET_Y}
                      />
              );
            })}
          </>
  );
};
