import {useCallback} from "react";
import {Graphics} from "@pixi/react";
import {OFFSET_X, OFFSET_Y, TILE_SIZE} from "@/pixi/constants/world-settings";
import type {Position} from "@/types/movement";
import {Graphics as PixiGraphics} from "pixi.js";
import {getBlockOffset} from "@/utils/doorBlockOffsets.ts";
import {RoomName} from "@/objects/Room.ts";

type DoorBlockerProps = {
  room: RoomName
  tile?: Position | null;
  tiles?: Position[];
  visible?: boolean;
  alpha?: number;
  color?: number;
};

export function DoorBlocker({
                              room,
                              tile,
                              tiles,
                              visible = true,
                              alpha = 0.45,
                              color = 0xff0000,
                            }: DoorBlockerProps) {
  const draw = useCallback(
          (g: PixiGraphics) => {
            g.clear();
            if (!visible) return;

            const toDraw = tiles ?? (tile ? [tile] : []);
            if (!toDraw.length) return;

            for (const t of toDraw) {
              g.beginFill(color, alpha);
              g.drawCircle(
                      OFFSET_X + t.x * TILE_SIZE + getBlockOffset(room).x,
                      OFFSET_Y + t.y * TILE_SIZE + getBlockOffset(room).y,
                      TILE_SIZE / 2
              );
              g.endFill();
              g.beginFill(0xFFFFFF, 0.8);
              g.drawRect(
                      (OFFSET_X + t.x * TILE_SIZE )+ getBlockOffset(room).bx,
                      (OFFSET_Y + t.y * TILE_SIZE) + getBlockOffset(room).by,
                      TILE_SIZE * 0.8,
                      TILE_SIZE /6
                      );
              g.endFill();
            }
          },
          [tile, tiles, visible, alpha, color, room]
  );


  return <Graphics draw={draw} />;
}