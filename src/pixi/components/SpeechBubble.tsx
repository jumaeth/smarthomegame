import {Container, Graphics, Text} from "@pixi/react";
import * as PIXI from "pixi.js";
import {TILE_SIZE} from "@/pixi/constants/world-settings";
import {t} from "@lingui/core/macro";
import {getSpeechBubbleProps} from "@/utils/speechBubbleProps";

export type SpeechBubbleProps = {
  x: number,
  y: number,
  element: string,
  width?: number,
  height?: number,
  color?: number,
  textColor?: number,
  textXOffset?: number,
  textYOffset?: number,
  textSize?: number
}

export function SpeechBubble({
                                    x,
                                    y,
                                    element,
                                  }: SpeechBubbleProps) {

  const textMap: Record<string, string> = {
    HallwayFrog: t`Quaaak`,
    LivingRoomCandles: t`Cozy, isn't it?`,
    LivingRoomFood: t`Yummy!!`,
    KitchenPainting: t`A real Picasso!`,
    BathroomChick: t`Am I an easter egg?`,
    BathroomDrawer: t`Looking pretty today`,
  };

  const text = textMap[element] ?? "";

  const props: SpeechBubbleProps = getSpeechBubbleProps(element, x, y);

  const w = props.width ?? TILE_SIZE;
  const h = props.height ?? TILE_SIZE * 0.3;
  const radius = TILE_SIZE * 0.05;
  const stroke = Math.max(1, Math.round(TILE_SIZE * 0.06));

  const style = new PIXI.TextStyle({
    fontFamily: "LoResRegular",
    fontSize: props.textSize ?? 3,
    fill: props.textColor ?? 0x00000,
    align: "center",
    wordWrap: true,
    wordWrapWidth: w * 0.9,
  });

  return (
  <Container x={props.x} y={props.y}>
    <Graphics
            draw={(g) => {
      g.clear();
      g.lineStyle(stroke, props.color ?? 0xffffff, 1);
      g.beginFill(props.color ?? 0xffffff, 1);
      g.drawRoundedRect(-w / 2, -h, w, h, radius);
      g.endFill();
    }}
    />
    <Text
    text={text}
    style={style}
    resolution={Math.ceil(window.devicePixelRatio) * 6}
    anchor={0.5}
    x={props.textXOffset ?? 0}
    y={props.textYOffset ?? -h / 2.25}
    roundPixels
    />
  </Container>
);
}
