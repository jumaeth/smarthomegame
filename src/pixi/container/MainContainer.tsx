import {forwardRef, useCallback, useMemo, useRef, useState} from "react";
import {Container, Graphics} from "@pixi/react";
import {MovementButtons} from "@/components/general-ui/MovementButtons.tsx";
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
import {HeadUpDisplay} from "@/pixi/components/HeadUpDisplay.tsx";
import {GameService} from "@/services/GameService.ts";

interface MainContainerProps {
  canvasSize: { width: number; height: number };
  map: MapKey;
  collisionMap: number[];
  onMapChange: (newMap: MapKey) => void;
  isPaused?: boolean;
  children?: React.ReactNode;
  gameService: GameService;
  interactiveElements?: any[];
}

export const MainContainer = forwardRef<unknown, MainContainerProps>(({
                                                                        canvasSize,
                                                                        map,
                                                                        collisionMap,
                                                                        onMapChange,
                                                                        isPaused = false,
                                                                        children,
                                                                        gameService,
                                                                        interactiveElements,
                                                                      }) => {
  const [inTransition, setInTransition] = useState(false);
  const [pendingTransition, setPendingTransition] = useState<{ to: MapKey, spawn: Position } | null>(null);
  const [shouldSnapCamera, setShouldSnapCamera] = useState(false);
  const [spawnPosition, setSpawnPosition] = useState<Position>({ x: DEFAULT_POS_X, y: DEFAULT_POS_Y });
  const [characterPosition, setCharacterPosition] = useState({
    x: Math.floor(spawnPosition.x / TILE_SIZE),
    y: Math.floor(spawnPosition.y / TILE_SIZE),
  });

  const characterTexture = useMemo(() => loadTexture(characterImage), []);
  const { levelTexture, overlayTexture, doorTexture } = useLevelTextures(map);

  const updateCharacterPosition = useCallback((pos: Position) => {
    const tileX = Math.floor(pos.x / TILE_SIZE);
    const tileY = Math.floor(pos.y / TILE_SIZE);
    setCharacterPosition({ x: tileX, y: tileY });
  }, []);

  const handleCharacterMove = (pos: Position) => {
    const tileX = Math.floor(pos.x / TILE_SIZE);
    const tileY = Math.floor(pos.y / TILE_SIZE);

    const transition = getMapTransition(map, tileX, tileY);

    if (transition) {
      const spawn = getSpawnForMap(transition.to, map);
      setPendingTransition({
        to: transition.to,
        spawn: spawn?.pos
                ? { x: spawn.pos.x * TILE_SIZE, y: spawn.pos.y * TILE_SIZE }
                : { x: DEFAULT_POS_X, y: DEFAULT_POS_Y },
      });
      setInTransition(true);
      setShouldSnapCamera(true);
    }
    updateCharacterPosition(pos);
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
                      characterPosition={characterPosition}
                      canvasSize={canvasSize}
                      shouldSnap={shouldSnapCamera}
                      onSnapComplete={() => setShouldSnapCamera(false)}
              >
                <Level texture={levelTexture} />
                <Character
                        ref={characterRef}
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
                          updateCharacterPosition(pendingTransition.spawn);
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
              <MovementButtons
                      canvasSize={canvasSize}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      onMoveLeft={handleMoveLeft}
                      onMoveRight={handleMoveRight}
                      onInteract={handleInteract}
              />
            </Container>
          </>
  );
});