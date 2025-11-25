import React, {useMemo, useState} from "react";
import {Sprite} from "@pixi/react";
import {useLoadTextures} from "@/hooks/useLoadTextures.tsx";
import {ProgressBarIcons} from "@/pixi/components/ProgressBar/ProgressBarIcons.tsx";
import {GameService} from "@/services/GameService.ts";
import trophyUrl from "@/assets/progressBar/trophy.png";

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
          () => ({trophy: trophyUrl}),
          []
  );
  const {textures, loaded} = useLoadTextures(texturePaths);
  const [showIcons, setShowIcons] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);

  const action = () => {
    setShowIcons(!showIcons);
  }

  const trophyHeight: number = windowHeight * 0.09325;
  const trophyWidth: number = windowWidth * 0.04375;
  const spacing: number = 15;

  return (
          <>
            {loaded && (<Sprite
                    x={x}
                    y={y}
                    height={trophyHeight}
                    width={trophyWidth}
                    interactive={true}
                    pointerover={() => setHovered(true)}
                    pointerdown={action}
                    pointerout={() => setHovered(false)}
                    cursor={hovered ? "pointer" : "default"}
                    texture={textures.trophy}
                    anchor={0}
            >
            </Sprite>)}
            {showIcons && <ProgressBarIcons
                    x={x + trophyWidth + spacing}
                    y={y}
                    trophyHeight={trophyHeight}
                    gameService={gameService}
            />}
          </>
  )
};
