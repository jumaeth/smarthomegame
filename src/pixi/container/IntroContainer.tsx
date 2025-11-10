import {Container, Graphics, Sprite} from "@pixi/react";
import {PropsWithChildren, useMemo, useState} from "react";
import {Texture} from "@pixi/core";
import {PixiButton} from "@/pixi/components/PixiButton";
import {getLocaleFromCookie} from "@/utils/cookie/languageCookie.ts";

const introFrames = import.meta.glob("@/assets/intro/*/Frame*.png", {
  eager: true,
}) as Record<string, { default: string }>;

function getIntroFrames(locale: string): string[] {
  return Object.entries(introFrames)
          .filter(([path]) => path.includes(`/intro/${locale}/`))
          .sort(([a], [b]) => a.localeCompare(b)) // ensures Frame01, Frame02, etc.
          .map(([, mod]) => mod.default);
}

interface IntroContainerProps {
  canvasSize: {
    width: number;
    height: number
  };
  onStart?: () => void;
}

export const IntroContainer = ({canvasSize, onStart}: PropsWithChildren<IntroContainerProps>) => {
  const locale = getLocaleFromCookie();

  const textures = useMemo(() => {
    const frames = getIntroFrames(locale);
    return frames.map((src) => Texture.from(src));
  }, [locale]);

  const [frame, setFrame] = useState(0);

  const nextFrame = () => {
    setFrame(f => (f + 1 < textures.length ? f + 1 : f));
  };

  const prevFrame = () => {
    setFrame(f => (f - 1 >= 0 ? f - 1 : f));
  };

  let width, height;
  if (canvasSize.width / canvasSize.height > 3/2) {
    height = canvasSize.height;
    width = height * (3/2);
  } else {
    width = canvasSize.width;
    height = width * (2/3);
  }

  return (
          <>
            <Container
              width={width}
              height={height}
              x={(canvasSize.width - width) / 2}
              y={(canvasSize.height - height) / 2}
              interactive={true}
            >
              <Graphics
                      interactive={false}
                      draw={g => {
                        g.clear();
                        g.beginFill(0x38373a);
                        g.drawRect(0, 0, width, height);
                        g.endFill();
                      }}
              />
              <Sprite
                      interactive={false}
                      texture={textures[frame]}
                      width={width}
                      height={height}
              />
              {frame > 0 && <PixiButton
                      label={"< Previous"}
                      x={width - 330}
                      y={height - 100}
                      width={120}
                      height={50}
                      onClick={() => prevFrame()}
              />}
              {frame < textures.length - 1 ? (
                      <PixiButton
                              label={"Next >"}
                              x={width - 200}
                              y={height - 100}
                              width={120}
                              height={50}
                              onClick={nextFrame}
                      />
              ) : (
                      <PixiButton
                              label={"Start"}
                              x={width - 200}
                              y={height - 100}
                              width={120}
                              height={50}
                              onClick={onStart ?? (() => {})}
                      />
              )}
            </Container>
          </>
  )
}