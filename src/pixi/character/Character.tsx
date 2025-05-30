import { Texture } from "pixi.js";
import {Container, Sprite, useTick} from "@pixi/react";
import {useCallback, useEffect, useRef} from "react";
import {ANIMATION_SPEED, DEFAULT_POS_X, DEFAULT_POS_Y, MOVE_SPEED} from "@/pixi/constants/world-settings";
import {useCharacterControls} from "@/hooks/character/useCharacterControls";
import {Direction, Position} from "@/types/movement";
import {calculateNewTarget, checkCanMove, handleCharacterMovement} from "@/utils/movment";
import {useCharacterAnimation} from "@/hooks/character/useCharacterAnimation";

interface CharacterProps {
  texture: Texture;
  onMove:(gridX: number, gridY: number) => void;
}

export const Character = ({texture, onMove}: CharacterProps) => {
  const position = useRef({x: DEFAULT_POS_X, y: DEFAULT_POS_Y})
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

  useEffect(() => {
    onMove(position.current.x, position.current.y)
  }, [onMove]);

  const setNextTarget = useCallback((direction: Direction) => {
    if (targetPosition.current) return
    const {x, y} = position.current;
    currentDirection.current = direction;
    const newTarget = calculateNewTarget(x, y, direction);

    if (checkCanMove(newTarget)) {
      targetPosition.current = newTarget;
    }
  }, [])

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
        const {x, y} = position.current;
        onMove(x, y)
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