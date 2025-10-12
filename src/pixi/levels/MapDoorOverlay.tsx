import { Sprite } from "@pixi/react";
import { Texture } from "@pixi/core";
import { useEffect, useState } from "react";
import { MapKey, Transition } from "@/types/maps";
import { DoorState } from "@/types/door";
import { GameService } from "@/services/GameService";
import { GAME_WIDTH, GAME_HEIGHT, OFFSET_X, OFFSET_Y } from "@/pixi/constants/world-settings";

type Props = {
  map: MapKey;
  transitions: Transition[];
  textures?: Texture[]; // [Closed, HalfOpen, Open]
  gameService: GameService;
};

export default function MapDoorOverlay({ map, transitions, textures, gameService }: Props) {
  const [, tick] = useState(0);

  useEffect(() => {
    return gameService.subscribeExitStates(() => tick(v => v + 1));
  }, [gameService]);

  if (!textures || textures.length < 3 || !transitions?.length) return null;

  // Recomputed every render, so it reflects latest exit states
  const anyClosed = transitions.some(t => gameService.getExitState(map, t.to) === DoorState.Closed);
  const anyHalf   = transitions.some(t => gameService.getExitState(map, t.to) === DoorState.HalfOpen);
  const frameIndex = anyClosed ? 0 : (anyHalf ? 1 : 2);

  return (
          <Sprite
                  texture={textures[frameIndex]}
                  x={OFFSET_X}
                  y={OFFSET_Y}
                  width={GAME_WIDTH}
                  height={GAME_HEIGHT}
          />
  );
}
