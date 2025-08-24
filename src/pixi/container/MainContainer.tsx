import React, {PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from "react";
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
import {useTutorialEnabled} from "@/utils/tutorialEnabled.ts";

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
                              }: PropsWithChildren<MainContainerProps>) => {
  const [inTransition, setInTransition] = useState(false);
  const [pendingTransition, setPendingTransition] =
          useState<{ to: MapKey; spawn: Position } | null>(null);
  const [shouldSnapCamera, setShouldSnapCamera] = useState(false);
  const characterTexture = useMemo(() => loadTexture(characterImage), []);
  const { levelTexture, overlayTexture, doorTexture } = useLevelTextures(map);
  const { tile: characterTile } = useCharacterPosition();
  const { enabled: tutorialEnabled, close: closeTutorial } = useTutorialEnabled();


  const [spawnPosition, setSpawnPosition] = useState<Position>({
    x: DEFAULT_POS_X,
    y: DEFAULT_POS_Y,
  });

  const handleCharacterMove = (pos: Position) => {
    characterPositionStore.set(pos);

    const tileX = Math.floor(pos.x / TILE_SIZE);
    const tileY = Math.floor(pos.y / TILE_SIZE);
    const transition = getMapTransition(map, tileX, tileY);

    if (transition) {
      const spawn = getSpawnForMap(transition.to, map);
      const nextSpawn: Position = spawn?.pos
              ? { x: spawn.pos.x * TILE_SIZE, y: spawn.pos.y * TILE_SIZE }
              : { x: DEFAULT_POS_X, y: DEFAULT_POS_Y };

      setPendingTransition({ to: transition.to, spawn: nextSpawn });
      setInTransition(true);
      setShouldSnapCamera(true);
    }
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
                <Character
                        texture={characterTexture}
                        onMove={handleCharacterMove}
                        collisionMap={collisionMap}
                        spawnPosition={spawnPosition}
                        isPaused={isPaused}
                        interactiveElements={interactiveElements}
                />
                <LevelOverlay texture={overlayTexture} />
                <Door textures={doorTexture} state={DoorState.Open} />
              </Camera>

              <TransitionOverlay
                      width={canvasSize.width}
                      height={canvasSize.height}
                      inTransition={inTransition}
                      onMidTransition={() => {
                        if (pendingTransition) {
                          onMapChange(pendingTransition.to);
                          setSpawnPosition(pendingTransition.spawn);
                          characterPositionStore.teleport(pendingTransition.spawn);
                          setShouldSnapCamera(true);
                          setPendingTransition(null);
                        }
                      }}
                      onTransitionEnd={() => setInTransition(false)}
              />

              <HeadUpDisplay
                      windowWidth={canvasSize.width}
                      windowHeight={canvasSize.height}
                      gameService={gameService}
              />
              {tutorialEnabled && <Tutorial
                      windowWidth={canvasSize.width}
                      windowHeight={canvasSize.height}
                      gameService={gameService}
                      characterPositon={characterTile}
                      onClose={closeTutorial}
              />}
            </Container>
          </>
  );
}