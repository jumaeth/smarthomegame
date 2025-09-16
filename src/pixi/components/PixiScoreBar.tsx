import {Container, Graphics, Sprite} from "@pixi/react";
import React from "react";


import {Texture} from "@pixi/core";


interface PixiScoreBarProps {
  x: number;
  y: number;
  width: number;
  progress: number; // 1 to 100
  texture: Texture;
}

export const PixiScoreBar: React.FC<PixiScoreBarProps> = ({
                                                                  x,
                                                                  y,
                                                                  width,
                                                                  progress,
                                                                  texture
                                                                }: PixiScoreBarProps) => {
  const height = width / 5;
  if (progress > 100) {
    progress = 100
  }
  if (progress < 0) {
    progress = 0
  }
  const iconWidth: number = width / 5;
  const margin: number = 10;
  const progressWidth: number = width - margin - iconWidth;
  const progressHeight: number = height / 3;
  const borderWidth: number = 2;
  const progressLength: number = (progressWidth - borderWidth * 2) / 100 * progress

  return (
          <Container
                  x={x}
                  y={y}
                  interactive={false}
          >
            <Sprite
                    interactive={false}
                    texture={texture}
                    width={iconWidth}
                    height={iconWidth}
            />
            <Graphics
                    draw={g => {
                      g.clear();
                      g.beginFill(0x000000);
                      g.drawRoundedRect(iconWidth + margin, height / 2 - progressHeight / 2, progressWidth, progressHeight, 8);
                      g.beginFill(0xf0b100);
                      g.drawRoundedRect(iconWidth + margin + borderWidth, height / 2 - progressHeight / 2 + borderWidth,
                              progressLength, progressHeight - (borderWidth * 2), 8 - borderWidth);
                      g.endFill();
                    }}
            />


          </Container>
  )
};
