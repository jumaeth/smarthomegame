// SpeechBubbleReact.tsx
import { Container, Graphics, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import { TILE_SIZE } from "@/pixi/constants/world-settings";

export function SpeechBubbleReact({
                                    x, y, text, color = 0xffffff, textColor = 0x000000,
                                  }: { x:number; y:number; text:string; color?:number; textColor?:number }) {
  const tile = TILE_SIZE;
  const w = Math.max(tile * 3, text.length * 6 + tile * 0.7);
  const h = tile * 1.2;
  const radius = tile * 0.12;
  const stroke = Math.max(1, Math.round(tile * 0.06));

  const style = new PIXI.TextStyle({
    fontFamily: "LoResRegular",
    fontSize: 12,
    fill: textColor,
    align: "center",
    wordWrap: true,
    wordWrapWidth: w - tile * 0.7,
    resolution: window.devicePixelRatio || 1,
  });

  return (
          <Container x={x} y={y}>
  <Graphics
          draw={(g) => {
    g.clear();
    g.lineStyle(stroke, color, 1);
    g.beginFill(color, 1);
    g.drawRoundedRect(-w / 2, -h, w, h, radius);
    g.endFill();
  }}
  />
  <Text
  text={text}
  style={style}
  anchor={0.5 as any}
  x={0}
  y={-h / 2 - tile * 0.05}
  roundPixels
  />
  </Container>
);
}
