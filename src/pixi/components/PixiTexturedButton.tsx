import {Container, Sprite} from "@pixi/react";
import React from "react";


import {Texture} from "@pixi/core";


interface PixiTexturedButtonProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onClick: () => void;
  texture: Texture;
}

export const PixiTexturedButton: React.FC<PixiTexturedButtonProps> = ({
                                                                        x,
                                                                        y,
                                                                        width,
                                                                        height,
                                                                        onClick,
                                                                        texture
                                                                      }: PixiTexturedButtonProps) => (
        <Container
                x={x}
                y={y}
                interactive={true}
                cursor="pointer"
                pointertap={onClick} // Use the event prop directly
        >
          <Sprite
                  interactive={false}
                  texture={texture}
                  width={width}
                  height={height}
          />
        </Container>
);