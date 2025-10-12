import React, {useEffect, useMemo, useState} from "react";
import {Sprite} from "@pixi/react";
import {useLoadTextures} from "@/hooks/useLoadTextures.tsx";
import {ProgressBarIcons} from "@/pixi/components/ProgressBar/ProgressBarIcons.tsx";
import {GameService} from "@/services/GameService.ts";
import trophyUrl from "@/assets/progressBar/trophy.png";
import {ProgressBarStatusStore} from "@/utils/progressBarStatus.ts";

interface ProgressBarProps {
  x: number;
  y: number;
  windowWidth: number;
  windowHeight: number;
  gameService: GameService;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
                                                          x,
                                                          y,
                                                          windowWidth,
                                                          windowHeight,
                                                          gameService
                                                        }: ProgressBarProps) => {

  const texturePaths = useMemo(
          () => ({ trophy: trophyUrl }),
          []
  );
  const {textures, loaded} = useLoadTextures(texturePaths);
  const [onLoad, setOnLoad] = useState<boolean>(true);
  const [, forceUpdate] = useState(0);
  const [hovered, setHovered] = useState<boolean>(false);

  useEffect(() => {
    ProgressBarStatusStore.set(false);
    const unsubscribe = ProgressBarStatusStore.subscribe(() => {
      forceUpdate((n) => n + 1); // trigger re-render
    });
    return unsubscribe;
  }, []);

  const action = () => {
    ProgressBarStatusStore.toggle();
  };

  return (
          <>
            {loaded && (<Sprite
                    x={x}
                    y={y}
                    scale={{ x: windowWidth * 0.00005, y: windowHeight * 0.0001 }}
                    interactive={true}
                    pointerover={() => setHovered(true)}
                    pointerdown={action}
                    pointerout={() => setHovered(false)}
                    cursor={hovered ? "pointer" : "default"}
                    texture={textures.trophy}
                    anchor={0}
            >
            </Sprite>)}
            {ProgressBarStatusStore.get() && <ProgressBarIcons
                    x={x}
                    y={y}
                    windowWidth={windowWidth}
                    windowHeight={windowHeight}
                    gameService={gameService}
            />}
          </>
  )
};
