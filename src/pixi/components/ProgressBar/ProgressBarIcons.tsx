import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Graphics, Sprite} from "@pixi/react";
import {useLoadTextures} from "@/hooks/useLoadTextures.tsx";
import {Graphics as PixiGraphics} from "pixi.js";
import {getDeviceTexture} from "@/pixi/components/ProgressBar/devices.ts";
import {GameService} from "@/services/GameService.ts";
import {SmartDevice} from "@/objects/SmartDevice.ts";

interface ProgressBarIconsProps {
    x: number;
    y: number;
    windowWidth: number;
    windowHeight: number;
    gameService: GameService;
}

export const ProgressBarIcons: React.FC<ProgressBarIconsProps> = ({
                                                            x,
                                                            y,
                                                            windowWidth,
                                                            windowHeight,
                                                            gameService
                                                        }: ProgressBarIconsProps) => {

    const [smartDevices, setSmartDevices] = useState<SmartDevice[]>(
            gameService.getAllRooms().flatMap(r => r.devices) ?? []);

    const [completedPercentage, setCompletedPercentage] = useState<number>(
            (100 / smartDevices.length) * smartDevices.filter(sd => sd.getIsCompleted()).length);

    useEffect(() => {
      setCompletedPercentage((100 / smartDevices.length) * smartDevices.filter(sd => sd.getIsCompleted()).length);
    }, [smartDevices]);

    useEffect(() => {
      const unsubscribeDevice = gameService.onDeviceStateChanged(() => {
        setSmartDevices(gameService.getAllRooms().flatMap(r => r.devices) ?? []);
      });

      return () => {
        unsubscribeDevice();
      };
    }, [gameService]);

    const deviceEntries = useMemo(() =>
                    smartDevices
                            .map(sd => {
                              const url = getDeviceTexture(sd.name, sd.getIsCompleted());
                              return url ? [sd.name, url] as const : null;
                            })
                            .filter(Boolean) as ReadonlyArray<readonly [string, string]>,
            [smartDevices]
    );

    const texturePaths = useMemo(
            () => Object.fromEntries(deviceEntries),
            [deviceEntries]
    );
    const {textures, loaded} = useLoadTextures(texturePaths);

    const drawBackground = useCallback((g: PixiGraphics) => {
        g.clear();
        g.beginFill(0xe89600, 0.7);
        g.lineStyle(3, 0xe89600);
        g.drawRoundedRect(
            x + windowWidth * 0.05,
            y + windowHeight * 0.05,
                windowWidth * 0.0175 + windowWidth * 0.031 * Object.entries(texturePaths).length,
            windowHeight * 0.07,
            8
        );
        g.endFill();
    }, [x, y, windowWidth, windowHeight, textures.length]);

    const drawCompletionBars = useCallback((g: PixiGraphics) => {

      const barX = x + windowWidth * 0.055;
      const barY = y + windowHeight * 0.055;
      const full = windowWidth * 0.0325 * Object.entries(texturePaths).length * 0.97;


      g.clear();
      g.beginFill(0x000000, 1);
      g.drawRoundedRect(
              barX,
              barY,
              windowWidth * 0.0325 * Object.entries(texturePaths).length,
              windowHeight * 0.015,
              10
      );
      g.beginFill(0xe89600, 1);
      g.drawRoundedRect(
              barX + windowWidth * 0.0025,
              barY + windowHeight * 0.005,
              full / 100 * completedPercentage,
              windowHeight * 0.005,
              10
      );
      g.endFill();
    }, [x, y, windowWidth, windowHeight, textures.length, completedPercentage]);

    return (
        <>
            <Graphics
                draw={drawBackground}
            />

            <Graphics
                    draw={drawCompletionBars}
            />

            {loaded && Object.entries(textures).map(([name, tex], idx) => (
                    <Sprite
                            key={name}
                            x={x + windowWidth * 0.0675 + windowWidth * 0.035 * idx}
                            y={y + windowHeight * 0.095}
                            texture={tex}
                            scale={{ x: windowWidth * 0.000025, y: windowHeight * 0.00005 }}
                            anchor={0.5}
                    />
            ))}
        </>
    )
};
