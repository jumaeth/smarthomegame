import React, {PropsWithChildren, useEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics} from "@pixi/react";
import {Texture} from "pixi.js";

import {Level} from "@/pixi/levels/Level";
import {LevelOverlay} from "@/pixi/levels/LevelOverlay";
import {DoorFloor} from "@/pixi/levels/DoorFloor";
import {DoorFrame} from "@/pixi/levels/DoorFrame";

import {Camera} from "@/pixi/camera/Camera";
import {TransitionOverlay} from "@/pixi/components/TransitionOverlay";
import {HeadUpDisplay} from "@/pixi/components/HeadUpDisplay";
import {MovementButtons} from "@/components/general-ui/MovementButtons";
import {ProximityHighlight} from "@/pixi/components/ProximityHighlight";
import {DoorBlocker} from "@/pixi/components/DoorBlocker";
import {Tutorial} from "@/pixi/components/Tutorial/Tutorial";

import characterImage from "@/assets/character/character_movement.png";
import {Character} from "@/pixi/character/Character";

import {DEFAULT_POS_X, DEFAULT_POS_Y, TILE_SIZE} from "@/pixi/constants/world-settings";
import {MapKey} from "@/types/maps";
import {RoomName} from "@/objects/Room";
import {DoorState} from "@/types/door";
import {Direction, Position} from "@/types/movement";

import {useLevelTextures} from "@/hooks/map/useLevelTextures";
import {getMapTransition, getSpawnForMap, getTransitionsForMap} from "@/utils/mapTransition";
import {loadTexture} from "@/utils/loadTexture";
import {characterPositionStore, useCharacterPosition} from "@/utils/characterPosition";
import {useTutorialActive} from "@/hooks/gameService/useTutorialActive";

import {InteractivePixiElement} from "@/objects/InteractivePixiElement";
import {GameService} from "@/services/GameService";

interface MainContainerProps {
  canvasSize: { width: number; height: number };
  map: MapKey;
  collisionMap: number[];
  onMapChange: (newMap: MapKey) => void;
  isPaused?: boolean;
  children?: React.ReactNode;
  interactiveElements?: InteractivePixiElement[];
  gameService: GameService;
  room: RoomName;
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
                                room,
                              }: PropsWithChildren<MainContainerProps>) => {
  const [assetsReady, setAssetsReady] = useState(false);
  const [cameraSettled, setCameraSettled] = useState(false);
  const [shouldSnapCamera, setShouldSnapCamera] = useState(false);

  const [inTransition, setInTransition] = useState(false);
  const [pendingTransition, setPendingTransition] =
          useState<{ to: MapKey; spawn: Position; face?: Direction } | null>(null);

  //const [spawnPosition, setSpawnPosition] = useState<Position>({ x: DEFAULT_POS_X, y: DEFAULT_POS_Y });

  const characterTexture = useMemo<Texture>(() => loadTexture(characterImage), []);
  const { levelTexture, overlayTexture, doorFloorTexture, doorFrameTexture } = useLevelTextures(map);
  const { tile: characterTile } = useCharacterPosition();
  const { enabled: tutorialActive, close: closeTutorial } = useTutorialActive();
  const [blockedDoorTile, setBlockedDoorTile] = useState<Position | null>(null);

  useEffect(() => { setShouldSnapCamera(true); setCameraSettled(false); }, [map]);

  useEffect(() => {
    let alive = true;

    const toList = (t: unknown): Texture[] =>
            !t ? [] : Array.isArray(t) ? (t.filter(Boolean) as Texture[]) : [t as Texture];

    const texList: Texture[] = [
      ...toList(levelTexture),
      ...toList(overlayTexture),
      ...toList(doorFloorTexture),
      ...toList(doorFrameTexture),
    ].filter(Boolean);

    const waitTexture = (t: Texture) =>
            t.baseTexture.valid
                    ? Promise.resolve()
                    : new Promise<void>((res) => t.baseTexture.once("loaded", () => res()));

    (async () => {
      await Promise.all(texList.map(waitTexture));
      requestAnimationFrame(() => { if (alive) setAssetsReady(true); });
    })();

    return () => { alive = false; setAssetsReady(false); };
  }, [levelTexture, overlayTexture, doorFloorTexture, doorFrameTexture]);

  // Character movement & transitions
  const characterRef = useRef<{
    moveUp: () => void; moveDown: () => void; moveLeft: () => void; moveRight: () => void; interact: () => void;
  } | null>(null);

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

    if (isLocked) { setBlockedDoorTile(transition.pos); return; }

    setBlockedDoorTile(null);

    const spawn = getSpawnForMap(transition.to, map);
    const nextSpawn: Position = spawn?.pos
            ? { x: spawn.pos.x * TILE_SIZE, y: spawn.pos.y * TILE_SIZE }
            : { x: DEFAULT_POS_X, y: DEFAULT_POS_Y };

    const face: Direction = spawn?.face ?? "UP";

    setPendingTransition({ to: transition.to, spawn: nextSpawn, face });
    setInTransition(true);
    setShouldSnapCamera(true);
  };

  const handleMoveUp = () => characterRef.current?.moveUp();
  const handleMoveDown = () => characterRef.current?.moveDown();
  const handleMoveLeft = () => characterRef.current?.moveLeft();
  const handleMoveRight = () => characterRef.current?.moveRight();
  const handleInteract = () => characterRef.current?.interact();

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
                      onSnapComplete={() => { setShouldSnapCamera(false); setCameraSettled(true); }}
                      tutorialEnabled={tutorialActive}
              >
                {(assetsReady && cameraSettled) && (
                        <>
                          <Level texture={levelTexture} />
                          <ProximityHighlight interactiveElements={interactiveElements} />
                          <DoorFloor room={room} map={map} gameService={gameService} textures={doorFloorTexture} />
                          <Character
                                  ref={characterRef}
                                  texture={characterTexture}
                                  onMove={handleCharacterMove}
                                  collisionMap={collisionMap}
                                  isPaused={isPaused}
                                  interactiveElements={interactiveElements}
                          />
                          <LevelOverlay texture={overlayTexture} />
                          {getTransitionsForMap(map).map((tr, i) => (
                                  <DoorFrame
                                          key={i}
                                          textures={doorFrameTexture}
                                          map={map}
                                          gameService={gameService}
                                          index={i}
                                          transition={tr}
                                  />
                          ))}
                          <DoorBlocker room={room} tile={blockedDoorTile} visible={!!blockedDoorTile} />
                        </>
                )}
              </Camera>

              {!tutorialActive && (
                      <TransitionOverlay
                              width={canvasSize.width}
                              height={canvasSize.height}
                              inTransition={inTransition}
                              onMidTransition={() => {
                                if (pendingTransition) {
                                  //setSpawnPosition(pendingTransition.spawn);
                                  characterPositionStore.teleport(pendingTransition.spawn, pendingTransition.face);
                                  onMapChange(pendingTransition.to);
                                  setPendingTransition(null);
                                }
                              }}
                              onTransitionEnd={() => {
                                setInTransition(false)
                              }}
                      />
              )}

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
              <HeadUpDisplay
                      windowWidth={canvasSize.width}
                      windowHeight={canvasSize.height}
                      gameService={gameService}
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
};
