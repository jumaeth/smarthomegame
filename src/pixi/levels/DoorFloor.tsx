import {Sprite} from "@pixi/react";
import {GAME_HEIGHT, GAME_WIDTH, OFFSET_X, OFFSET_Y} from "@/pixi/constants/world-settings";
import {Texture} from "@pixi/core";
import {getTransitionsForMap} from "@/utils/mapTransition.ts";
import {MapKey} from "@/types/maps.ts";
import {GameService} from "@/services/GameService.ts";
import {RoomNames} from "@/objects/RoomNames.ts";

interface LevelProps {
  textures: Texture[] | undefined;
  room: RoomNames;
  map: MapKey;
  gameService: GameService;
}

export const DoorFloor = ({ textures, room, map, gameService }: LevelProps) => {
  if (!textures) return null;
  if (gameService.getRoom(room).isLocked) return null;


  return (
          <>
            {textures.slice(0, getTransitionsForMap(map).length).map((texture, i) => (
                    <Sprite
                            key={`floor-${i}`}
                            texture={texture}
                            width={GAME_WIDTH}
                            height={GAME_HEIGHT}
                            x={OFFSET_X}
                            y={OFFSET_Y}
                            scale={1}
                    />
            ))}
          </>
  )
};
