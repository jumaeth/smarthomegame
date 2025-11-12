import {forwardRef, PropsWithChildren, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Container as PixiContainer} from "pixi.js"
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {Container} from "@pixi/react";
import {useCharacterPosition} from "@/hooks/character/useCharacterPosition.ts";
import {getNearbyInteractiveElement} from "@/utils/character/proximity.ts";
import {pixelToTile} from "@/utils/coords";
import {getHighlightPosition} from "@/utils/highlightPositions.tsx";

interface ProximityHighlightProps {
  interactiveElements?: InteractivePixiElement[];
}


export const ProximityHighlight = forwardRef(({
                                                interactiveElements,
                                              }: PropsWithChildren<ProximityHighlightProps>, ref) => {
  const pos = useCharacterPosition();
  const graphicRef = useRef<PixiContainer | null>(null);
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
    console.log(interactive)
    if (!interactive) {
      setInteractive(null);
      return;
    }

    setInteractive(interactive);
  }, [pos, interactiveElements]);

  const getPosition = () => {
    return interactive ? {x: interactive.x, y: interactive.y} : {x: 0, y: 0}
  }

  return (
          <>
            <Container ref={graphicRef}/>
            {getPosition().x != 0 && interactive && getHighlightPosition(interactive, getPosition())}
          </>
  );
})