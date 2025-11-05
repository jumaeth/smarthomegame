import {useCallback} from "react";
import {Graphics} from "@pixi/react";
import {OFFSET_X, OFFSET_Y, TILE_SIZE} from "@/pixi/constants/world-settings";
import type {Position} from "@/types/movement";
import {Graphics as PixiGraphics} from "pixi.js";
import {getBlockOffset} from "@/utils/doorBlockOffsets.ts";
import {RoomNames} from "@/objects/RoomNames.ts";

type DoorBlockerProps = {
  room: RoomNames
  ww: number;
  wh: number;
  to
  visible?: boolean;
  alpha?: number;
  color?: number;
};

export function DoorBlocker({
                              room,
                              ww,
                              wh,
                              to,
                              visible = true,
                              alpha = 0.45,
                              color = 0xff0000,
                            }: DoorBlockerProps) {
  const draw = useCallback(
          (g: PixiGraphics) => {
            g.clear();
            if (!visible || !to) return;

            const offset = getBlockOffset(room, to, ww, wh)

            g.beginFill(color, alpha);
            g.drawCircle(
                    offset.x,
                    offset.y,
                    ww * 0.006
            );
            g.endFill();
            g.beginFill(0xFFFFFF, 0.8);
            g.drawRect(
                    offset.bx,
                    offset.by,
                    ww * 0.01,
                    wh * 0.004
            );
            g.endFill();
          },
          [to, visible, alpha, color, room]
  );


  return <Graphics draw={draw} />;
}