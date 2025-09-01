import {Container, Sprite} from "@pixi/react";
import React, {  useMemo, useRef } from 'react';
import {Texture, Rectangle} from "@pixi/core";

interface PixiTexturedButtonProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onClick?: () => void;
  onHold?: () => void;
  texture: Texture;
}

export const PixiTexturedButton: React.FC<PixiTexturedButtonProps> = ({
                                                                        x,
                                                                        y,
                                                                        width,
                                                                        height,
                                                                        onClick,
                                                                        onHold,
                                                                        texture
                                                                      }: PixiTexturedButtonProps) => {
  const holdInterval = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = () => {
    if (onHold) {
      holdInterval.current = setInterval(() => {
        onHold();
      }, 200); // Debounce von 200ms
    }
  };

  const handlePointerUp = () => {
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
      holdInterval.current = null;
    }
  };

  const hitArea = useMemo(() => {
    const hitScale:number=2;
    const w: number = width * hitScale;
    const h: number = height * hitScale;
    return new Rectangle(-w / 2, -h / 2, w, h);
  }, [width, height]);

  return (
          <Container
                  x={x}
                  y={y}
                  interactive={true}
                  cursor="pointer"
                  pointertap={onClick}
                  pointerdown={handlePointerDown}
                  pointerup={handlePointerUp}
                  pointerupoutside={handlePointerUp}
                  hitArea={hitArea}
          >
            <Sprite
                    interactive={false}
                    texture={texture}
                    width={width}
                    height={height}
            />
          </Container>
  );
};