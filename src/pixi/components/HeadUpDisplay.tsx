import assistantPhone from "@/assets/assistant-phone/assistant_phone_background.png";
import privacyCoin from "@/assets/coins/privacy_coin.png";
import comfortCoin from "@/assets/coins/comfort_coin.png";
import {PixiTexturedButton} from "@/pixi/components/PixiTexturedButton.tsx";
import {PixiScoreBar} from "@/pixi/components/PixiScoreBar.tsx";
import {Texture} from "@pixi/core";
import React, {PropsWithChildren, useEffect, useMemo, useState} from "react";
import {AssistantPhone} from "@/pixi/components/AssistantPhone.tsx";
import {Graphics} from "@pixi/react";
import {GameService} from "@/services/GameService.ts";
import {ProgressBar} from "@/pixi/components/ProgressBar/ProgressBar.tsx";

interface HeadUpDisplayProps {
  windowWidth: number;
  windowHeight: number;
  gameService: GameService;
}

export const HeadUpDisplay: React.FC<HeadUpDisplayProps> = ({
                                                              windowWidth,
                                                              windowHeight,
                                                              gameService
                                                            }: PropsWithChildren<HeadUpDisplayProps>) => {
  // Assistant Phone
  const textures = useMemo(() => [Texture.from(assistantPhone), Texture.from(privacyCoin), Texture.from(comfortCoin)], []);
  const [assistantPhoneIsOpen, setAssistantPhoneIsOpen] = useState(false);
  const [privacyScore, setPrivacyScore] = useState(0);
  const [comfortScore, setComfortScore] = useState(0);

  useEffect(() => {
    const updateScores = () => {
      const score = gameService.getScore();
      setPrivacyScore(score.getPrivacyScore());
      setComfortScore(score.getComfortScore());
    };

    updateScores(); // initial load
    const interval = setInterval(updateScores, 500); // or on-demand if gameService supports listeners

    return () => clearInterval(interval);
  }, [gameService]);

  const openAssistantPhone: () => void = (): void => {
    gameService.pauseGame();
    setAssistantPhoneIsOpen(true);
  }

  const closeAssistantPhone: () => void = (): void => {
    setAssistantPhoneIsOpen(false);
    gameService.resumeGame();
  }

  const assistantPhoneIconWidth: number = windowWidth * 0.1;
  const assistantPhoneIconHeight: number = assistantPhoneIconWidth * 1.5;
  const assistantPhoneIconPosX: number = 0;
  const assistantPhoneIconPosY: number = 0;
  const ProgressBarWidth: number = windowWidth * 0.13;
  const spacing: number = 30;

  return (
          <>
            {!assistantPhoneIsOpen && (
                    <PixiTexturedButton
                            texture={textures[0]}
                            x={assistantPhoneIconPosX}
                            y={assistantPhoneIconPosY}
                            width={assistantPhoneIconWidth}
                            height={assistantPhoneIconHeight}
                            onClick={openAssistantPhone}
                    />
            )}
            {assistantPhoneIsOpen && (
                    <>
                      <Graphics
                              interactive={true}
                              pointertap={closeAssistantPhone}
                              draw={g => {
                                g.clear();
                                g.alpha = 0.5;
                                g.beginFill(0x38373a);
                                g.drawRect(0, 0, windowWidth, windowHeight);
                                g.endFill();
                              }}
                      />
                      <AssistantPhone
                              windowWidth={windowWidth}
                              windowHeight={windowHeight}
                              onClickExit={closeAssistantPhone}
                      />
                    </>

            )}
            <PixiScoreBar
                    x={windowWidth - ProgressBarWidth - 10}
                    y={10}
                    width={ProgressBarWidth}
                    progress={privacyScore}
                    texture={textures[1]}
            />
            <PixiScoreBar
                    x={windowWidth - ProgressBarWidth - 10}
                    y={10 + ProgressBarWidth / 5 + 10}
                    width={ProgressBarWidth}
                    progress={comfortScore}
                    texture={textures[2]}
            />
            <ProgressBar
                    x={assistantPhoneIconWidth + spacing}
                    y={spacing}
                    windowWidth={windowWidth}
                    gameService={gameService}/>
          </>
  )
};