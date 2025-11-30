import { Container, Sprite } from "@pixi/react";
import React, { useMemo } from "react";
import { Texture } from "@pixi/core";
import assistantPhoneMap from "@/assets/assistant-phone/assistant_phone_minimap.png";
import { PixiButton } from "@/pixi/components/PixiButton.tsx";
import { t } from "@lingui/core/macro";

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

        const texture = useMemo(() => Texture.from(assistantPhoneMap), []);

        const phoneHeight = windowHeight * 0.80;
        const phoneSize = { height: phoneHeight, width: phoneHeight * 1.7 }
        const phonePosition = { x: windowWidth / 2, y: windowHeight / 2 };

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
                                texture={texture}
                                width={phoneSize.width}
                                height={phoneSize.height}
                        />
                        <PixiButton x={10}
                                y={10}
                                width={150} height={50}
                                onClick={onClickExit}
                                label={t`< Go back to game`} />
                </Container>
        );
}