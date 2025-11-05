import React, {PropsWithChildren, useEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics} from "@pixi/react";
import {Texture} from "pixi.js";

import {Level} from "@/pixi/levels/Level";
import characterImage from "@/assets/character/character_movement.png";
import {Character} from "@/pixi/character/Character";

import {DEFAULT_POS_X, DEFAULT_POS_Y, TILE_SIZE} from "@/pixi/constants/world-settings";
import {MapKey, Transition} from "@/types/maps";
import {DoorState} from "@/types/door";
import {Direction, Position} from "@/types/movement";

import {useLevelTextures} from "@/hooks/map/useLevelTextures";
import {getMapTransition, getSpawnForMap, getTransitionsForMap} from "@/utils/mapTransition";
import {loadTexture} from "@/utils/loadTexture";
import {MapKey} from "@/types/maps";
import {useLevelTextures} from "@/hooks/map/useLevelTextures";
import {getMapTransition, getSpawnForMap} from "@/utils/mapTransition";
import {Position} from "@/types/movement";
import {Door} from "@/pixi/levels/Door";
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
import {RoomNames} from "@/objects/RoomNames.ts";

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
    room: RoomNames;
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
    const [inTransition, setInTransition] = useState(false);
    const [pendingTransition, setPendingTransition] =
          useState<{ to: MapKey; spawn: Position; face?: Direction } | null>(null);
    const [shouldSnapCamera, setShouldSnapCamera] = useState(false);
    /**
     * State to track the spawn position of the character.
     */
    const [spawnPosition, setSpawnPosition] = useState<Position>({x: DEFAULT_POS_X, y: DEFAULT_POS_Y});

    const characterTexture = useMemo(() => loadTexture(characterImage), []);
  const { levelTexture, overlayTexture, doorFloorTexture,
    doorFrameFrontTexture, doorFrameBackTexture } = useLevelTextures(map);
  const { tile: characterTile } = useCharacterPosition();
  const { enabled: tutorialActive, close: closeTutorial } = useTutorialActive();
  const [blockedDoorTo, setBlockedDoorTo] = useState<RoomNames | null>(null);

  useEffect(() => { setShouldSnapCamera(true); setCameraSettled(false); }, [map]);

  useEffect(() => {
    let alive = true;

    const toList = (t: unknown): Texture[] =>
            !t ? [] : Array.isArray(t) ? (t.filter(Boolean) as Texture[]) : [t as Texture];

    const texList: Texture[] = [
      ...toList(levelTexture),
      ...toList(overlayTexture),
      ...toList(doorFloorTexture),
      ...toList(doorFrameFrontTexture),
      ...toList(doorFrameBackTexture),
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
  }, [levelTexture, overlayTexture, doorFloorTexture, doorFrameFrontTexture, doorFrameBackTexture]);

  const handleCharacterMove = (pos: Position) => {
    characterPositionStore.set(pos);

    const tileX = Math.floor(pos.x / TILE_SIZE);
    const tileY = Math.floor(pos.y / TILE_SIZE);
    const transition = getMapTransition(map, tileX, tileY);

    if (!transition || tutorialActive) {
      setBlockedDoorTo(null);
      return;
    }

    const exitState = gameService.getExitState(map, transition.to);
    const isLocked = exitState === DoorState.Closed;

    if (isLocked)
    { setBlockedDoorTo(roomNameToEnum(transition.to) ?? null); return; }

    setBlockedDoorTo(null);

    const spawn = getSpawnForMap(transition.to, map);
    const nextSpawn: Position = spawn?.pos
            ? { x: spawn.pos.x * TILE_SIZE, y: spawn.pos.y * TILE_SIZE }
            : { x: DEFAULT_POS_X, y: DEFAULT_POS_Y };

    const face: Direction = spawn?.face ?? "UP";

      setPendingTransition({ to: transition.to, spawn: nextSpawn });
      setInTransition(true);
      setShouldSnapCamera(true);
    }
  };

  const transitionFromTop = (tr: Transition): boolean => {
    return tr.to != RoomNames.BATHROOM
  }

  const doorFrame = (state: boolean) =>
          getTransitionsForMap(map)
            .filter(tr => transitionFromTop(tr))
            .map((tr, i) => (
                    <DoorFrame
                            key={`${map}-${tr.to}-${i}`}
                            index={i}
                            textures={state ? doorFrameBackTexture : doorFrameFrontTexture}
                            map={map}
                            gameService={gameService}
                            transition={tr}
                    />
            ));

  const characterRef = useRef<{
    moveUp: () => void;
    moveDown: () => void;
    moveLeft: () => void;
    moveRight: () => void;
    interact: () => void
  } | null>(null);

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
                          {doorFrame(true)}
                          <Character
                                  ref={characterRef}
                                  texture={characterTexture}
                                  onMove={handleCharacterMove}
                                  collisionMap={collisionMap}
                                  isPaused={isPaused as boolean}
                                  spawnPosition={spawnPosition}
                                  interactiveElements={interactiveElements}
                          />
                          <LevelOverlay texture={overlayTexture} />
                          {doorFrame(false)}
                          <DoorBlocker
                                  room={room}
                                  to={blockedDoorTo}
                                  visible={!!blockedDoorTo}
                                  ww={canvasSize.width}
                                  wh={canvasSize.height}
                          />
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
                      interactiveElements={interactiveElements as InteractivePixiElement[]}
              />}
            </Container>
          </>
  );
}