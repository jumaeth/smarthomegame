import { Container, Graphics, Text } from "@pixi/react";
import * as PIXI from "pixi.js";

export interface PixiButtonProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onClick: () => void;
  label: string;
}

export const PixiButton: React.FC<PixiButtonProps> = ({
                                                        x, y, width, height, onClick, label,
                                                      }) => (
        <Container
                x={x}
                y={y}
                interactive={true}
                cursor="pointer"
                pointertap={onClick} // Use the event prop directly
        >
          <Graphics
                  draw={g => {
                    g.clear();
                    g.beginFill(0x2222aa);
                    g.drawRoundedRect(0, 0, width, height, 8);
                    g.endFill();
                  }}
          />
          <Text
                  text={label}
                  anchor={0.5}
                  x={width / 2}
                  y={height / 2}
                  style={new PIXI.TextStyle({ fill: "#fff", fontSize: 18 })}
          />
        </Container>
);