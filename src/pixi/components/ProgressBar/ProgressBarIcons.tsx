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
  trophyHeight: number;
  gameService: GameService;
}

export const ProgressBarIcons: React.FC<ProgressBarIconsProps> = ({
                                                                    x,
                                                                    y,
                                                                    trophyHeight,
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
  const spacing: number = trophyHeight * 0.05;
  const iconHeight: number = trophyHeight * 0.8 - spacing * 4;
  const containerWidth: number = 2 * spacing + Object.entries(texturePaths).length * iconHeight;

  const drawBackground = useCallback((g: PixiGraphics) => {
    g.clear();
    g.beginFill(0xe89600, 0.7);
    g.lineStyle(3, 0xe89600);
    g.drawRoundedRect(
            x,
            y,
            containerWidth,
            trophyHeight,
            spacing
    );
    g.endFill();
  }, [x, y, containerWidth, trophyHeight, spacing]);

  const drawCompletionBars = useCallback((g: PixiGraphics) => {
    const colours = [0x990000, 0xFF0000, 0xFF3300, 0xFF6600, 0xFF9900,
      0xFFCC00, 0xFFFF00, 0xCCFF00, 0x99FF99, 0x00FF00]
    const index = Math.min(Math.floor(completedPercentage / 10), colours.length - 1);
    const progressColour = colours[index];
    const barX = x + spacing;
    const barY = y + spacing;
    const barWidth: number = containerWidth - spacing * 2;
    const barHeight: number = trophyHeight * 0.2;
    g.clear();
    g.beginFill(0x000000, 1);
    g.drawRoundedRect(
            barX,
            barY,
            barWidth,
            barHeight,
            10
    );
    g.beginFill(progressColour, 1);
    g.drawRoundedRect(
            barX,
            barY,
            barWidth / 100 * completedPercentage,
            barHeight,
            10
    );
    g.endFill();
  }, [x, y, trophyHeight, completedPercentage, containerWidth, spacing]);

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
                            x={x + spacing + iconHeight / 2 + iconHeight * idx}
                            y={y + trophyHeight * 0.6}
                            texture={tex}
                            width={iconHeight}
                            height={iconHeight}
                            anchor={0.5}
                    />
            ))}
          </>
  )
};
