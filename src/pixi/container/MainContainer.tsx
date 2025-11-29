import React, {PropsWithChildren, useEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics} from "@pixi/react";
import {Texture} from "pixi.js";

import {Level} from "@/pixi/levels/Level";
import {Character} from "@/pixi/character/Character";

import {DEFAULT_POS_X, DEFAULT_POS_Y, TILE_SIZE} from "@/pixi/constants/world-settings";
import {MapKey} from "@/types/maps";
import {DoorState} from "@/types/door";
import {Direction, Position} from "@/types/movement";

import {useLevelTextures} from "@/hooks/map/useLevelTextures";
import {getMapTransition, getSpawnForMap, getTransitionsForMap} from "@/utils/mapTransition";
import {loadTexture} from "@/utils/loadTexture";
import {TransitionOverlay} from "@/pixi/components/TransitionOverlay";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {HeadUpDisplay} from "@/pixi/components/HeadUpDisplay.tsx";
import {GameService} from "@/services/GameService.ts";
import {Tutorial} from "@/pixi/components/Tutorial/Tutorial.tsx";
import {characterPositionStore, useCharacterPosition} from "@/utils/character/characterPosition.ts";
import {useTutorialActive} from "@/hooks/gameService/useTutorialActive.ts";
import {MovementButtons} from "@/components/general-ui/MovementButtons.tsx";
import {ProximityHighlight} from "@/pixi/components/ProximityHighlight.tsx";
import {RoomNames, roomNameToEnum} from "@/objects/RoomNames.ts";
import {Camera} from "@/pixi/camera/Camera.tsx";
import {DoorFloor} from "@/pixi/levels/DoorFloor.tsx";
import {LevelOverlay} from "@/pixi/levels/LevelOverlay.tsx";
import {DoorBlocker} from "@/pixi/components/DoorBlocker.tsx";
import {DoorFrame} from "@/pixi/levels/DoorFrame.tsx";
import {getTexture} from "@/components/character/CharacterSelector.tsx";
import {SpeechBubble, SpeechBubbleProps} from "@/pixi/components/SpeechBubble.tsx";
import {InteractiveType} from "@/types/InteractiveType.ts";
import {DeviceNames, deviceNameToEnum} from "@/objects/DeviceNames.ts";

interface MainContainerProps {
  canvasSize: {
    width: number;
    height: number
  };
  map: MapKey;
  collisionMap: number[][];
  onMapChange: (newMap: MapKey) => void;
  isPaused?: boolean;
  children?: React.ReactNode;
  interactiveElements?: InteractivePixiElement[];
  gameService: GameService;
  room: RoomNames;
  onDeviceOpen?: (deviceName: DeviceNames) => void;
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
                                onDeviceOpen,
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
  const characterTexture = useMemo(() => loadTexture(getTexture()), []);
  const {
    levelTexture, overlayTexture, doorFloorTexture,
    doorFrameFrontTexture, doorFrameBackTexture
  } = useLevelTextures(map);
  const {tile: characterTile} = useCharacterPosition();
  const {done: tutorialDone, end: endTutorial} = useTutorialActive();

  const pixelSize = {
    width: TILE_SIZE * collisionMap[0].length,
    height: TILE_SIZE * collisionMap.length
  };

  /**
   * reference to control proximity highlights
   */
  const proximityRef = useRef<{ getNearbyInteractive: () => InteractivePixiElement | null } | null>(null);
  const [dummy, setDummy] = useState<SpeechBubbleProps | null>(null);
  const [blockedDoorTo, setBlockedDoorTo] = useState<RoomNames | null>(null);

  useEffect(() => {
    setShouldSnapCamera(true);
    setCameraSettled(false);
  }, [map]);

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
      requestAnimationFrame(() => {
        if (alive) setAssetsReady(true);
      });
    })();

    return () => {
      alive = false;
      setAssetsReady(false);
    };
  }, [levelTexture, overlayTexture, doorFloorTexture, doorFrameFrontTexture, doorFrameBackTexture]);

  const handleCharacterMove = (pos: Position) => {
    characterPositionStore.set(pos);

    const tileX = Math.floor(pos.x / TILE_SIZE);
    const tileY = Math.floor(pos.y / TILE_SIZE);
    const transition = getMapTransition(map, tileX, tileY);

    if (!transition || !tutorialDone || characterPositionStore.getFacing() != transition.faceToEnter) {
      setBlockedDoorTo(null);
      return;
    }

    const exitState = gameService.getExitState(map, transition.to);
    const isLocked = exitState === DoorState.Closed;

    if (isLocked) {
      setBlockedDoorTo(roomNameToEnum(transition.to) ?? null);
      return;
    }

    setBlockedDoorTo(null);

    const spawn = getSpawnForMap(transition.to, map);
    const nextSpawn: Position = spawn?.pos
            ? {x: spawn.pos.x * TILE_SIZE, y: spawn.pos.y * TILE_SIZE}
            : {x: DEFAULT_POS_X, y: DEFAULT_POS_Y};

    const face: Direction = spawn?.face ?? "UP";

    setPendingTransition({to: transition.to, spawn: nextSpawn, face: face});
    setInTransition(true);
    setShouldSnapCamera(true);
  };

  const showDummy = (p: SpeechBubbleProps) => {
    setDummy(p);
    window.setTimeout(() => setDummy(null), 1500);
  };

  const getDoorFrames = (room: RoomNames, state: boolean) => {
    const front = doorFrameFrontTexture
    const back = doorFrameBackTexture

    if (roomNameToEnum(map) != RoomNames.HALLWAY) return state ? doorFrameBackTexture : doorFrameFrontTexture
    if (state) {
      switch (room) {
        case RoomNames.LIVINGROOM:
          return [front[0], front[1], front[2]]
        case RoomNames.KITCHEN:
          return [front[3], front[4], front[5]]
        default:
          return []
      }
    } else {
      switch (room) {
        case RoomNames.BATHROOM:
          return [back[0], back[1], back[2]];
        case RoomNames.BEDROOM:
          return [back[3], back[4], back[5]];
        default:
          return [];
      }
    }
  }

  const doorFrame = (state: boolean) =>
          getTransitionsForMap(map)
                  .map((tr, i) => (
                          <DoorFrame
                                  key={`${map}-${tr.to}-${i}`}
                                  textures={getDoorFrames(roomNameToEnum(tr.to) as RoomNames, state)}
                                  map={map}
                                  gameService={gameService}
                                  transition={tr}
                                  pixelSize={pixelSize}
                          />
                  ));

  const handleInteraction = () => {
    const nearby = proximityRef.current?.getNearbyInteractive();
    if (!nearby) return;

    if (nearby.type === InteractiveType.SMART_DEVICE && onDeviceOpen) {
      const smartDevice = deviceNameToEnum(nearby.name);
      if(!smartDevice){
        throw new Error(`Smart device with name ${nearby.name} not found`);
      }
      onDeviceOpen(smartDevice);
    } else if (nearby.type === InteractiveType.DUMMY) {
      showDummy({x: nearby.x, y: nearby.y, element: nearby.name});
    }
  };

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
                      onSnapComplete={() => {
                        setShouldSnapCamera(false);
                        setCameraSettled(true);
                      }}
                      tutorialDone={!tutorialDone}
              >
                {(assetsReady && cameraSettled) && (
                        <>
                          <Level pixelSize={pixelSize} texture={levelTexture}/>
                          <DoorFloor pixelSize={pixelSize} room={room} map={map} gameService={gameService} textures={doorFloorTexture}/>
                          {doorFrame(true)}
                          <ProximityHighlight
                                  ref={proximityRef}
                                  interactiveElements={interactiveElements}
                                  gameService={gameService}
                          />
                          <Character
                                  ref={characterRef}
                                  texture={characterTexture}
                                  onMove={handleCharacterMove}
                                  collisionMap={collisionMap}
                                  isPaused={isPaused as boolean || inTransition}
                                  onInteractCheck={handleInteraction}
                          />
                          <LevelOverlay pixelSize={pixelSize} texture={overlayTexture}/>
                          {doorFrame(false)}
                          {dummy && (
                                  <SpeechBubble x={dummy.x} y={dummy.y} element={dummy.element}/>
                          )}
                          <DoorBlocker
                                  room={room}
                                  to={blockedDoorTo as RoomNames}
                                  visible={!!blockedDoorTo}
                                  ww={canvasSize.width}
                                  wh={canvasSize.height}
                          />
                        </>
                )}
              </Camera>
              {tutorialDone && (
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
              {!tutorialDone && <Tutorial
                      windowWidth={canvasSize.width}
                      windowHeight={canvasSize.height}
                      gameService={gameService}
                      onClose={endTutorial}
                      interactiveElements={interactiveElements as InteractivePixiElement[]}
              />}
            </Container>
          </>
  );
}