import {Container, Sprite} from "@pixi/react";
import React, {useRef} from "react";
import {Texture} from "@pixi/core";

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

  return (
          <Container
                  x={x}
                  y={y}
                  interactive={true}
                  cursor="pointer"
                  pointertap={onClick}
                  pointerdown={handlePointerDown}
                  pointerup={handlePointerUp}
                  pointerupoutside={handlePointerUp} // Stoppt auch, wenn der Zeiger außerhalb losgelassen wird
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