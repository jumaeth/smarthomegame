import {Container, Sprite} from "@pixi/react";
import React, {useMemo} from "react";


import {Texture} from "@pixi/core";
import assistantPhone from "@/assets/assistant-phone/assistant_phone_background.png";
import appIcon1 from "@/assets/assistant-phone/app_icon_1.png";
import appIcon2 from "@/assets/assistant-phone/app_icon_2.png";
import appIcon3 from "@/assets/assistant-phone/app_icon_3.png";
import appIcon4 from "@/assets/assistant-phone/app_icon_4.png";
import {PixiButton} from "@/pixi/components/PixiButton.tsx";

interface AssistantPhoneProps {
  windowWidth: number;
  windowHeight: number;
  onClickExit: () => void;
}

export const AssistantPhone: React.FC<AssistantPhoneProps> = ({
                                                                windowWidth,
                                                                windowHeight,
                                                                onClickExit
                                                              }: AssistantPhoneProps) => {

  const textures = useMemo(() => [
    Texture.from(assistantPhone),
    Texture.from(appIcon1),
    Texture.from(appIcon2),
    Texture.from(appIcon3),
    Texture.from(appIcon4),
  ], []);

  const phoneHeight = windowHeight * 0.95;
  const phoneSize = {height: phoneHeight, width: phoneHeight / 1.5}
  const phonePosition = {x: windowWidth / 2, y: windowHeight / 2};
  const appGap = 10;
  const appHeight = (phoneSize.height * 0.25 - appGap) / 2;
  const appSize = {width: appHeight, height: appHeight};
  const appOffset = appSize.height / 2 + appGap / 2;
  const appShift = -phoneSize.height * 0.1

  const onClickApp1 = () => {
  }
  const onClickApp2 = () => {
  }
  const onClickApp3 = () => {
  }
  const onClickApp4 = () => {
  }

  return (
          <Container
                  x={0}
                  y={0}
                  interactive={true}
          >
            <Sprite
                    anchor={0.5}
                    x={phonePosition.x}
                    y={phonePosition.y}
                    interactive={false}
                    texture={textures[0]}
                    width={phoneSize.width}
                    height={phoneSize.height}
            />
            <Sprite
                    anchor={0.5}
                    x={phonePosition.x - appOffset}
                    y={phonePosition.y - appOffset + appShift}
                    texture={textures[1]}
                    width={appSize.width}
                    height={appSize.height}
                    interactive={true}
                    cursor="pointer"
                    pointertap={onClickApp1}

            />
            <Sprite
                    anchor={0.5}
                    x={phonePosition.x + appOffset}
                    y={phonePosition.y - appOffset + appShift}
                    texture={textures[2]}
                    width={appSize.width}
                    height={appSize.height}
                    interactive={true}
                    cursor="pointer"
                    pointertap={onClickApp2}
            />
            <Sprite
                    anchor={0.5}
                    x={phonePosition.x - appOffset}
                    y={phonePosition.y + appOffset + appShift}
                    texture={textures[3]}
                    width={appSize.width}
                    height={appSize.height}
                    interactive={true}
                    cursor="pointer"
                    pointertap={onClickApp3}
            />
            <Sprite
                    anchor={0.5}
                    x={phonePosition.x + appOffset}
                    y={phonePosition.y + appOffset + appShift}
                    texture={textures[4]}
                    width={appSize.width}
                    height={appSize.height}
                    interactive={true}
                    cursor="pointer"
                    pointertap={onClickApp4}
            />
            <PixiButton x={10}
                        y={10}
                        width={150} height={50}
                        onClick={onClickExit}
                        label={"< Back to game"}/>
          </Container>
  );
}