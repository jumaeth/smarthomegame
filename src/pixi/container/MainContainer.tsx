import React, {PropsWithChildren, useEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics} from "@pixi/react";
import {Level} from "@/pixi/levels/Level";
import characterImage from "@/assets/character/character_movement.png";
import {Character} from "@/pixi/character/Character";
import {DEFAULT_POS_X, DEFAULT_POS_Y, TILE_SIZE} from "@/pixi/constants/world-settings";
import {Camera} from "@/pixi/camera/Camera";
import {LevelOverlay} from "@/pixi/levels/LevelOverlay";
import {loadTexture} from "@/utils/loadTexture";
import {MapKey} from "@/types/maps";
import {useLevelTextures} from "@/hooks/map/useLevelTextures";
import {getMapTransition, getSpawnForMap, getTransitionsForMap} from "@/utils/mapTransition";
import {Position} from "@/types/movement";
import {DoorState} from "@/types/door";
import {TransitionOverlay} from "@/pixi/components/TransitionOverlay";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {HeadUpDisplay} from "@/pixi/components/HeadUpDisplay.tsx";
import {GameService} from "@/services/GameService.ts";
import {Tutorial} from "@/pixi/components/Tutorial/Tutorial.tsx";
import {characterPositionStore, useCharacterPosition} from "@/utils/characterPosition.ts";
import {useTutorialActive} from "@/hooks/gameService/useTutorialActive.ts";
import {MovementButtons} from "@/components/general-ui/MovementButtons.tsx";
import {ProximityHighlight} from "@/pixi/components/ProximityHighlight.tsx";
import {DoorBlocker} from "@/pixi/components/DoorBlocker.tsx";
import {RoomName} from "@/objects/Room.ts";
import {DoorFloor} from "@/pixi/levels/DoorFloor.tsx";
import {DoorFrame} from "@/pixi/levels/DoorFrame.tsx";
import {Texture} from "@pixi/core";

interface MainContainerProps {
    canvasSize: {
        width: number;
        height: number
    };
    map: MapKey;
    collisionMap: number[];
    onMapChange: (newMap: MapKey) => void;
    isPaused?: boolean;
    children?: React.ReactNode;
    interactiveElements?: InteractivePixiElement[];
    gameService: GameService;
    room: RoomName
}

export const MainContainer = ({
                                  canvasSize,
                                  map,
                                  collisionMap,
                                  onMapChange,
                                  isPaused = false,
                                  children,
                                interactiveElements,
                                gameService,
                                room
                              }: PropsWithChildren<MainContainerProps>) => {
    const [inTransition, setInTransition] = useState(false);
    const [pendingTransition, setPendingTransition] = useState<{ to: MapKey, spawn: Position } | null>(null);

    const [shouldSnapCamera, setShouldSnapCamera] = useState(false);
    /**
     * State to track the spawn position of the character.
     */
    const [spawnPosition, setSpawnPosition] = useState<Position>({x: DEFAULT_POS_X, y: DEFAULT_POS_Y});

    const characterTexture = useMemo(() => loadTexture(characterImage), []);
  const { levelTexture, overlayTexture, doorFloorTexture, doorFrameTexture } = useLevelTextures(map);
  const { tile: characterTile } = useCharacterPosition();
  const { enabled: tutorialActive, close: closeTutorial } = useTutorialActive();
  const [blockedDoorTile, setBlockedDoorTile] = useState<Position | null>(null);

  const handleCharacterMove = (pos: Position) => {
    characterPositionStore.set(pos);

    const tileX = Math.floor(pos.x / TILE_SIZE);
    const tileY = Math.floor(pos.y / TILE_SIZE);
    const transition = getMapTransition(map, tileX, tileY);

    if (!transition || tutorialActive) {
      setBlockedDoorTile(null);
      return;
    }

    const exitState = gameService.getExitState(map, transition.to);
    const isLocked = exitState === DoorState.Closed;

    if (isLocked) {
      setBlockedDoorTile(transition.pos);
      return;
    }

    setBlockedDoorTile(null);

    if (transition && !tutorialActive) {
      const spawn = getSpawnForMap(transition.to, map);
      const nextSpawn: Position = spawn?.pos
              ? { x: spawn.pos.x * TILE_SIZE, y: spawn.pos.y * TILE_SIZE }
              : { x: DEFAULT_POS_X, y: DEFAULT_POS_Y };

      setPendingTransition({ to: transition.to, spawn: nextSpawn });
      setInTransition(true);
      setShouldSnapCamera(true);
    }
  };

  const characterRef = useRef<{ moveUp: () => void; moveDown: () => void; moveLeft: () => void; moveRight: () => void; interact: () => void } | null>(null);

  const handleMoveUp = () => {
    characterRef.current?.moveUp();
  };

  const handleMoveDown = () => {
    characterRef.current?.moveDown();
  };

  const handleMoveLeft = () => {
    characterRef.current?.moveLeft();
  };

  const handleMoveRight = () => {
    characterRef.current?.moveRight();
  };

  const handleInteract = () => {
    characterRef.current?.interact();
  };

  return (
          <>
            <Container>
              <Graphics
                      draw={(g) => {
                        g.clear();
                        g.beginFill(0x38373a);
                        g.drawRect(0, 0, canvasSize.width, canvasSize.height);
                        g.endFill();
                      }}
              />
              {children}
              <Camera
                      key={map}
                      characterPosition={characterTile}
                      canvasSize={canvasSize}
                      shouldSnap={shouldSnapCamera}
                      onSnapComplete={() => setShouldSnapCamera(false)}
              >
                <Level texture={levelTexture} />
                <ProximityHighlight interactiveElements={interactiveElements}/>
                <DoorFloor room={room} map={map} gameService={gameService} textures={doorFloorTexture}/>
                <Character
                        texture={characterTexture}
                        onMove={handleCharacterMove}
                        collisionMap={collisionMap}
                        spawnPosition={spawnPosition}
                        isPaused={isPaused}
                        interactiveElements={interactiveElements}
                    />
                <LevelOverlay texture={overlayTexture}/>
                {getTransitionsForMap(map).map((tr,i)=> {
                  return <DoorFrame textures={doorFrameTexture} map={map} gameService={gameService} index={i} transition={tr}/>
                })}
                <DoorBlocker room={room} tile={blockedDoorTile} visible={!!blockedDoorTile} />
                </Camera>
                {!tutorialActive && <TransitionOverlay
                    width={canvasSize.width}
                    height={canvasSize.height}
                    inTransition={inTransition}
                    onMidTransition={() => {
                        if (pendingTransition) {
                            setSpawnPosition(pendingTransition.spawn);
                            characterPositionStore.teleport(pendingTransition.spawn);
                            onMapChange(pendingTransition.to);
                            setShouldSnapCamera(true);
                            setPendingTransition(null);
                        }
                    }}
                    onTransitionEnd={() => setInTransition(false)}
                />}
              <HeadUpDisplay
                      windowWidth={canvasSize.width}
                      windowHeight={canvasSize.height}
                      gameService={gameService}
              />
              <MovementButtons
                      canvasSize={canvasSize}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      onMoveLeft={handleMoveLeft}
                      onMoveRight={handleMoveRight}
                      onInteract={handleInteract}
              />
              {tutorialActive && <Tutorial
                      windowWidth={canvasSize.width}
                      windowHeight={canvasSize.height}
                      gameService={gameService}
                      onClose={closeTutorial}
                      interactiveElements={interactiveElements  as InteractivePixiElement[]}
              />}
            </Container>
        </>
    );
}