import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef} from "react";
import {Texture} from "pixi.js";
import {Container, Sprite, useTick} from "@pixi/react";
import {ANIMATION_SPEED, MOVE_SPEED} from "@/pixi/constants/world-settings";
import {useCharacterControls} from "@/hooks/character/useCharacterControls";
import {Direction, Position} from "@/types/movement";
import {calculateNewTarget, checkCanMove, handleCharacterMovement} from "@/utils/character/movment";
import {useCharacterAnimation} from "@/hooks/character/useCharacterAnimation";
import {characterPositionStore, useCharacterPosition} from "@/utils/character/characterPosition.ts";
import {useMovementStore} from "@/utils/character/movementEnabled.ts";

interface CharacterProps {
  texture: Texture;
  onMove: (pos: Position) => void;
  collisionMap: number[][];
  isPaused: boolean;
  onInteractCheck?: () => void;
}

export const Character = forwardRef((
        {
          texture,
          onMove,
          collisionMap,
          isPaused = false,
          onInteractCheck,
        }: CharacterProps,
        ref
) => {
  const { pos } = useCharacterPosition();
  const posRef = useRef<Position>(pos);
  useEffect(() => { posRef.current = pos; }, [pos]);

  const targetPosition = useRef<Position | null>(null);
  const currentDirection = useRef<Direction>(characterPositionStore.getFacing());
  const isMoving = useRef(false);
  const lastFace = useRef<Direction>(currentDirection.current);

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
  }, [updateSprite]);

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

  const checkForInteraction = useCallback(() => {
    if (onInteractCheck) onInteractCheck();
  }, [onInteractCheck]);

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

    if (face !== lastFace.current) {
      lastFace.current = face;
      onMove(posRef.current);
    }

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
