import assistantPhone from "@/assets/assistant-phone/assistant_phone_background.png";
import {PixiTexturedButton} from "@/pixi/components/PixiTexturedButton.tsx";
import {Texture} from "@pixi/core";
import React, {PropsWithChildren, useMemo, useState} from "react";
import {AssistantPhone} from "@/pixi/components/AssistantPhone.tsx";
import {Graphics} from "@pixi/react";
import {GameService} from "@/services/GameService.ts";

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
  const textures = useMemo(() => [Texture.from(assistantPhone)], []);
  const [assistantPhoneIsOpen, setAssistantPhoneIsOpen] = useState(false);

  const openAssistantPhone: () => void = (): void => {
    gameService.pauseGame();
    setAssistantPhoneIsOpen(true);
  }

  const closeAssistantPhone: () => void = (): void => {
    setAssistantPhoneIsOpen(false);
    gameService.resumeGame();
  }

  const assistantPhoneIconWidth: number = 150;
  const assistantPhoneIconHeight: number = assistantPhoneIconWidth * 1.5;
  const assistantPhoneIconPosX: number = 0;
  const assistantPhoneIconPosY: number = 0;

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

          </>
  )
};