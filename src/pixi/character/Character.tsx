import { Texture } from "pixi.js";
import {Container, Sprite, useTick} from "@pixi/react";
import {useCallback, useEffect, useRef} from "react";
import {ANIMATION_SPEED, MOVE_SPEED} from "@/pixi/constants/world-settings";
import {useCharacterControls} from "@/hooks/character/useCharacterControls";
import {Direction, Position} from "@/types/movement";
import {calculateNewTarget, checkCanMove, handleCharacterMovement} from "@/utils/movment";
import {useCharacterAnimation} from "@/hooks/character/useCharacterAnimation";

interface CharacterProps {
  texture: Texture;
  onMove:(pos: Position) => void;
  collisionMap: number[];
  spawnPosition: Position;
}

export const Character = ({texture, onMove, collisionMap, spawnPosition}: CharacterProps) => {
  const position = useRef<Position>({ ...spawnPosition });
  const targetPosition = useRef<Position | null>(null);
  const currentDirection = useRef<Direction | null>(null);

  const {getControlsDirection} = useCharacterControls()

  const isMoving = useRef(false);
  const {sprite, updateSprite} = useCharacterAnimation({
    texture,
    frameHeight: 32,
    frameWidth: 32,
    totalFrames: 8,
    animationSpeed: ANIMATION_SPEED,
  })

  const setNextTarget = useCallback((direction: Direction) => {
    if (targetPosition.current) return
    const {x, y} = position.current;
    currentDirection.current = direction;
    const newTarget = calculateNewTarget(x, y, direction);

    if (checkCanMove(newTarget, collisionMap)) {
      targetPosition.current = newTarget;
    }
  }, [collisionMap])

  const teleportTo = useCallback((newPosition: Position) => {
    if (newPosition) {
      position.current = newPosition;
      targetPosition.current = null;
      isMoving.current = false;
    }
  }, []);

  useEffect(() => {
    teleportTo(spawnPosition)
  }, [spawnPosition]);

  useTick((delta) => {
    const direction = getControlsDirection();
    if (direction) {
      setNextTarget(direction);
    }
    // handle Movement
    if (targetPosition.current) {
      const {position: newPosition, completed} = handleCharacterMovement(position.current, targetPosition.current, MOVE_SPEED, delta);

      position.current = newPosition;
      isMoving.current = true;

      if (completed) {
        onMove(position.current)
        targetPosition.current = null;
        isMoving.current = false;
      }
    }

    updateSprite(currentDirection.current!, isMoving.current);
  })

  return (
          <>
            <Container>
              {sprite && (<Sprite
                      texture={sprite.texture}
                      x={position.current.x}
                      y={position.current.y}
                      scale={0.5}
                      anchor={[0, 0]}
              />)}
            </Container>
          </>
  );
}