import {forwardRef, PropsWithChildren, useEffect, useImperativeHandle, useRef, useState} from "react";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {useCharacterPosition} from "@/hooks/character/useCharacterPosition.ts";
import {getNearbyInteractiveElement} from "@/utils/character/proximity.ts";
import {pixelToTile} from "@/utils/coords";
import {getHighlightPosition} from "@/utils/highlightPositions.tsx";
import {GameService} from "@/services/GameService.ts";
import {deviceNameToEnum} from "@/objects/DeviceNames.ts";

interface ProximityHighlightProps {
  interactiveElements?: InteractivePixiElement[];
  gameService: GameService;
}


export const ProximityHighlight = forwardRef(({
                                                interactiveElements,
                                                gameService
                                              }: PropsWithChildren<ProximityHighlightProps>, ref) => {
  const pos = useCharacterPosition();
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [interactive, setInteractive] = useState<InteractivePixiElement | null>(null);

  useImperativeHandle(ref, () => ({
    getNearbyInteractive: () => interactive,
  }));

  useEffect(() => {
    if (!pos) return;

    // Only check if the position actually changed
    if (
            lastPos.current &&
            lastPos.current.x === pos.x &&
            lastPos.current.y === pos.y
    ) {
      return;
    }

    lastPos.current = pos;

    const playerTile = pixelToTile(pos.x, pos.y);
    const interactive = getNearbyInteractiveElement(playerTile, interactiveElements);
    if (!interactive) {
      setInteractive(null);
      return;
    }

    setInteractive(interactive);
  }, [pos, interactiveElements]);

  const getPosition = () => {
    return interactive ? {x: interactive.x, y: interactive.y} : {x: 0, y: 0}
  }
  let isCompleted = false;
  if (interactive?.name) {
    const deviceName = deviceNameToEnum(interactive.name);
    if (deviceName) {
      isCompleted = !gameService.getDeviceByName(deviceName).getIsCompleted()
    }
  }
  return (
          <>
            {isCompleted && getPosition().x != 0 && interactive && getHighlightPosition(interactive, getPosition())}
          </>
  );
})