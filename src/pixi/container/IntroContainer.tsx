import {Container, Graphics, Sprite} from "@pixi/react";
import {PropsWithChildren, useMemo, useState} from "react";
import frame1 from "@/assets/intro/de/DE_Frame01.png";
import frame2 from "@/assets/intro/de/DE_Frame02.png";
import frame3 from "@/assets/intro/de/DE_Frame03.png";
import frame4 from "@/assets/intro/de/DE_Frame04.png";
import frame5 from "@/assets/intro/de/DE_Frame05.png";
import {Texture} from "@pixi/core";
import {PixiButton} from "@/pixi/components/PixiButton";

interface IntroContainerProps {
  canvasSize: {
    width: number;
    height: number
  };
  onStart?: () => void;
}

export const IntroContainer = ({canvasSize, onStart}: PropsWithChildren<IntroContainerProps>) => {
  const textures = useMemo(() => [
    Texture.from(frame1),
    Texture.from(frame2),
    Texture.from(frame3),
    Texture.from(frame4),
    Texture.from(frame5),
  ], []);

  const [frame, setFrame] = useState(0);

  const nextFrame = () => {
    setFrame(f => (f + 1 < textures.length ? f + 1 : f));
  };

  const prevFrame = () => {
    setFrame(f => (f - 1 >= 0 ? f - 1 : f));
  };


  return (
          <>
            <Container interactive={true}>
              <Graphics
                      interactive={false}
                      draw={g => {
                        g.clear();
                        g.beginFill(0x38373a);
                        g.drawRect(0, 0, canvasSize.width, canvasSize.height);
                        g.endFill();
                      }}
              />
              <Sprite
                      interactive={false}
                      texture={textures[frame]}
                      width={canvasSize.width}
                      height={canvasSize.height}
              />
              {frame > 0 && <PixiButton
                      label={"< Previous"}
                      x={canvasSize.width - 330}
                      y={canvasSize.height - 100}
                      width={120}
                      height={50}
                      onClick={() => prevFrame()}
              />}
              {frame < textures.length - 1 ? (
                      <PixiButton
                              label={"Next >"}
                              x={canvasSize.width - 200}
                              y={canvasSize.height - 100}
                              width={120}
                              height={50}
                              onClick={nextFrame}
                      />
              ) : (
                      <PixiButton
                              label={"Start"}
                              x={canvasSize.width - 200}
                              y={canvasSize.height - 100}
                              width={120}
                              height={50}
                              onClick={onStart ?? (() => {})}
                      />
              )}
            </Container>
          </>
  )
}