import React from "react";
import {PixiTexturedButton} from "@/pixi/components/PixiTexturedButton.tsx";
import {Texture} from "pixi.js";
import arrowUpIcon from "@/assets/ui/icons/arrow_up.png";
import arrowDownIcon from "@/assets/ui/icons/arrow_down.png";
import arrowLeftIcon from "@/assets/ui/icons/arrow_left.png";
import arrowRightIcon from "@/assets/ui/icons/arrow_right.png";
import actionIcon from "@/assets/ui/icons/action.png";

interface MovementButtonsProps {
  canvasSize: { width: number; height: number };
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onInteract: () => void;
}

export const MovementButtons: React.FC<MovementButtonsProps> = ({
                                                                  canvasSize,
                                                                  onMoveUp,
                                                                  onMoveDown,
                                                                  onMoveLeft,
                                                                  onMoveRight,
                                                                  onInteract,
                                                                }) => {
  const arrowUpTexture = Texture.from(arrowUpIcon);
  const arrowDownTexture = Texture.from(arrowDownIcon);
  const arrowLeftTexture = Texture.from(arrowLeftIcon);
  const arrowRightTexture = Texture.from(arrowRightIcon);
  const actionTexture = Texture.from(actionIcon);

  const inMobileDevice = window.navigator.maxTouchPoints > 2;

  let buttonSize: number; // Größere Buttons für Touchscreens
  let centerX: number;
  let centerY: number; // Buttons näher am unteren Bildschirmrand
  if(canvasSize.height<=canvasSize.width){
    centerY = canvasSize.height * 0.7
    centerX = canvasSize.width * 0.15
    buttonSize = canvasSize.height * 0.1
  }else{
    centerX = canvasSize.width * 0.25
    centerY = canvasSize.height * 0.8
    buttonSize      = canvasSize.width * 0.1

  }

  return (
          <>
            {inMobileDevice && (
                    <>
                      <PixiTexturedButton
                              texture={arrowUpTexture}
                              x={centerX}
                              y={centerY - buttonSize * 1.5}
                              width={buttonSize}
                              height={buttonSize}
                              onHold={onMoveUp}
                      />
                      <PixiTexturedButton
                              texture={arrowDownTexture}
                              x={centerX}
                              y={centerY + buttonSize * 1.5}
                              width={buttonSize}
                              height={buttonSize}
                              onHold={onMoveDown}
                      />
                      <PixiTexturedButton
                              texture={arrowLeftTexture}
                              x={centerX - buttonSize * 1.5}
                              y={centerY}
                              width={buttonSize}
                              height={buttonSize}
                              onHold={onMoveLeft}
                      />
                      <PixiTexturedButton
                              texture={arrowRightTexture}
                              x={centerX + buttonSize * 1.5}
                              y={centerY}
                              width={buttonSize}
                              height={buttonSize}
                              onHold={onMoveRight}
                      />
                      <PixiTexturedButton
                              texture={actionTexture}
                              x={centerX}
                              y={centerY}
                              width={buttonSize}
                              height={buttonSize}
                              onClick={onInteract}
                      />
                    </>
            )}
          </>
  );
};