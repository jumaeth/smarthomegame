import {Texture} from "pixi.js";
import {Container, Sprite, useTick} from "@pixi/react";
import {useCallback, useEffect, useRef, useState} from "react";
import {ANIMATION_SPEED, MOVE_SPEED, TILE_SIZE} from "@/pixi/constants/world-settings";
import {useCharacterControls} from "@/hooks/character/useCharacterControls";
import {Direction, Position} from "@/types/movement";
import {calculateNewTarget, checkCanMove, handleCharacterMovement} from "@/utils/movment";
import {useCharacterAnimation} from "@/hooks/character/useCharacterAnimation";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {characterPositionStore} from "@/utils/characterPosition.ts";
import {useMovementStore} from "@/utils/movementEnabled.ts";

interface CharacterProps {
    texture: Texture;
    onMove: (pos: Position) => void;
    collisionMap: number[];
    spawnPosition: Position;
    isPaused: boolean;
    interactiveElements?: InteractivePixiElement[];
}

export const Character = ({texture, onMove, collisionMap, spawnPosition, isPaused = false, interactiveElements}: CharacterProps) => {
    const position = useRef<Position>({...spawnPosition});
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

    const { movementEnabled, disable } = useMovementStore();

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
            characterPositionStore.teleport(newPosition);
        }
    }, []);

  useEffect(() => {
    const off = characterPositionStore.onTeleport((next) => {
      position.current = next;
      targetPosition.current = null;
      isMoving.current = false;
      currentDirection.current = 'DOWN' as Direction;
    });
    return () => { off(); };
  }, []);

    useEffect(() => {
        teleportTo(spawnPosition)
    }, [spawnPosition, teleportTo]);


    function checkForInteraction() {
        if (!position.current) {
            return;
        }

        const targetX = position.current.x / TILE_SIZE;
        const targetY = position.current.y / TILE_SIZE;

        const interactiveElement = interactiveElements?.find(element => {
            const elementLeft = element.x-1;
            const elementRight = element.x + (element.width ) ;
            const elementTop = element.y-1;
            const elementBottom = element.y + (element.height) ;
            return (
                targetX >= elementLeft &&
                targetX <= elementRight &&
                targetY >= elementTop &&
                targetY <= elementBottom
            );
        });
        if (interactiveElement) {
            interactiveElement.interaction();
        }
    }

    useTick((delta) => {
        const pauseRequested = isPaused || !movementEnabled;

        if(!pauseRequested){
          const direction = getControlsDirection();
          if (direction && direction == 'INTERACT') {
            checkForInteraction()
          } else if (direction) {
            setNextTarget(direction);
          }

        }
          // handle Movement
        if (targetPosition.current) {
          const {
            position: newPosition,
            completed
          } = handleCharacterMovement(position.current, targetPosition.current, MOVE_SPEED, delta);

          position.current = newPosition;
          isMoving.current = true;
          characterPositionStore.set(newPosition);

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