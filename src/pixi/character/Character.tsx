import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef} from "react";
import {Texture} from "pixi.js";
import {Container, Sprite, useTick} from "@pixi/react";
import {ANIMATION_SPEED, MOVE_SPEED, TILE_SIZE} from "@/pixi/constants/world-settings";
import {useCharacterControls} from "@/hooks/character/useCharacterControls";
import {Direction, Position} from "@/types/movement";
import {calculateNewTarget, checkCanMove, handleCharacterMovement} from "@/utils/character/movment";
import {useCharacterAnimation} from "@/hooks/character/useCharacterAnimation";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {InteractiveType} from "@/types/InteractiveType.ts";
import {SpeechBubbleProps} from "@/pixi/components/SpeechBubble.tsx";
import {characterPositionStore, useCharacterPosition} from "@/utils/character/characterPosition.ts";
import {useMovementStore} from "@/utils/character/movementEnabled.ts";

interface CharacterProps {
  texture: Texture;
  onMove: (pos: Position) => void;
  collisionMap: number[];
  isPaused: boolean;
  interactiveElements?: InteractivePixiElement[];
  onShowDummy?: (p: SpeechBubbleProps) => void;
}

export const Character = forwardRef((
        {
          texture,
          onMove,
          collisionMap,
          isPaused = false,
          interactiveElements,
          onShowDummy,
        }: CharacterProps,
        ref
) => {
  const { pos } = useCharacterPosition();
  const posRef = useRef<Position>(pos);
  useEffect(() => { posRef.current = pos; }, [pos]);

  const targetPosition = useRef<Position | null>(null);
  const currentDirection = useRef<Direction>(characterPositionStore.getFacing());
  const isMoving = useRef(false);

  const { direction } = useCharacterControls();
  const { movementEnabled } = useMovementStore();

  const { sprite, updateSprite } = useCharacterAnimation({
    texture,
    frameHeight: 32,
    frameWidth: 32,
    totalFrames: 8,
    animationSpeed: ANIMATION_SPEED,
  });

  useEffect(() => {
    updateSprite(currentDirection.current, false);
  }, []);

  const setNextTarget = useCallback((dir: Direction) => {
    if (targetPosition.current) return;
    const { x, y } = posRef.current;
    currentDirection.current = dir;
    characterPositionStore.setFacing(dir);
    const newTarget = calculateNewTarget(x, y, dir);
    if (checkCanMove(newTarget, collisionMap)) targetPosition.current = newTarget;
  }, [collisionMap]);

  useEffect(() => {
    const off = characterPositionStore.onTeleport(({ dir }) => {
      targetPosition.current = null;
      isMoving.current = false;
      if (dir) characterPositionStore.setFacing(dir);
      currentDirection.current = dir ?? characterPositionStore.getFacing();
      updateSprite(currentDirection.current, false);
    });
    return () => { off(); };
  }, [updateSprite]);

  const checkForProximity = () => {
    const { x, y } = posRef.current;
    const targetX = x / TILE_SIZE;
    const targetY = y / TILE_SIZE;

    const interactiveElement = interactiveElements?.find(element => {
      const elementLeft = element.x - 1;
      const elementRight = element.x + element.width;
      const elementTop = element.y - 1;
      const elementBottom = element.y + element.height;
      return (
              targetX >= elementLeft &&
              targetX <= elementRight &&
              targetY >= elementTop &&
              targetY <= elementBottom
      );
    });

    return interactiveElement ?? null;
  };

  const checkForInteraction = () => {
    const interactiveElement = checkForProximity();
    if (!interactiveElement) return;


    if (interactiveElement.type === InteractiveType.SMART_DEVICE) {
      interactiveElement.interaction();
      return;
    }

    if (interactiveElement.type === InteractiveType.DUMMY && onShowDummy) {
      onShowDummy({
        x: interactiveElement.x,
        y: interactiveElement.y,
        element: interactiveElement.name,
      });
    }
  };

  useImperativeHandle(ref, () => ({
    moveUp: () => setNextTarget("UP"),
    moveDown: () => setNextTarget("DOWN"),
    moveLeft: () => setNextTarget("LEFT"),
    moveRight: () => setNextTarget("RIGHT"),
    interact: () => checkForInteraction(),
  }));

  useTick((delta) => {
    const pauseRequested = isPaused || !movementEnabled;

    if (!pauseRequested) {
      if (direction && direction === "INTERACT") {
        checkForInteraction();
      } else if (direction) {
        setNextTarget(direction);
      }
    }

    if (targetPosition.current) {
      const {
        position: newPosition,
        completed,
      } = handleCharacterMovement(posRef.current, targetPosition.current, MOVE_SPEED, delta);

      characterPositionStore.set(newPosition);
      isMoving.current = true;

      if (completed) {
        onMove(newPosition);
        targetPosition.current = null;
        isMoving.current = false;
      }
    }

    const face = currentDirection.current ?? characterPositionStore.getFacing();
    updateSprite(face, isMoving.current);
  });

  return (
          <Container>
            {sprite && (
                    <Sprite
                            texture={sprite.texture}
                            x={pos.x}
                            y={pos.y}
                            scale={0.5}
                            anchor={[0, 0]}
                    />
            )}
          </Container>
  );
});
