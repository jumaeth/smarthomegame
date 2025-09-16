import React, {useMemo, useState} from "react";
import {Sprite} from "@pixi/react";
import {useLoadTextures} from "@/hooks/useLoadTextures.tsx";
import {ProgressBarIcons} from "@/pixi/components/ProgressBar/ProgressBarIcons.tsx";
import {GameService} from "@/services/GameService.ts";

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
          () => ({ trophy: "/src/assets/progressBar/trophy.png" }),
          []
  );
  const {textures, loaded} = useLoadTextures(texturePaths);
  const [showIcons, setShowIcons] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);

  const action = () => {
    setShowIcons(!showIcons);
  }

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
            {showIcons && <ProgressBarIcons
                    x={x}
                    y={y}
                    windowWidth={windowWidth}
                    windowHeight={windowHeight}
                    gameService={gameService}
            />}
          </>
  )
};
