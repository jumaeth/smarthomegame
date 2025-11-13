import {Sprite} from "@pixi/react";
import {OFFSET_X, OFFSET_Y} from "@/pixi/constants/world-settings";
import {Texture} from "@pixi/core";
import {getTransitionsForMap} from "@/utils/mapTransition.ts";
import {MapKey} from "@/types/maps.ts";
import {GameService} from "@/services/GameService.ts";
import {RoomNames} from "@/objects/RoomNames.ts";

interface LevelProps {
  pixelSize: {
    width: number;
    height: number
  };
  textures: Texture[] | undefined;
  room: RoomNames;
  map: MapKey;
  gameService: GameService;
}

export const DoorFloor = ({ pixelSize, textures, room, map, gameService }: LevelProps) => {
  if (!textures) return null;
  if (gameService.getRoom(room).isLocked) return null;

  return (
          <>
            {textures.slice(0, getTransitionsForMap(map).length).map((texture, i) => (
                    <Sprite
                            key={`floor-${i}`}
                            texture={texture}
                            width={pixelSize.width}
                            height={pixelSize.height}
                            x={OFFSET_X}
                            y={OFFSET_Y}
                            scale={1}
                    />
            ))}
          </>
  )
};
