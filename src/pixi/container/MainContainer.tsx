import {PropsWithChildren, useCallback, useMemo, useState} from "react";
import {Container, Graphics} from "@pixi/react";
import {Level} from "@/pixi/levels/Level";
import characterImage from "@/assets/character/character_movement.png";
import {Character} from "@/pixi/character/Character";
import {DEFAULT_POS_X, DEFAULT_POS_Y, TILE_SIZE} from "@/pixi/constants/world-settings";
import {Camera} from "@/pixi/camera/Camera";
import {LevelOverlay} from "@/pixi/levels/LevelOverlay";
import {loadTexture} from "@/utils/loadTexture";
import {DeviceKey, MapKey} from "@/types/maps";
import {useLevelTextures} from "@/hooks/map/useLevelTextures";
import {getMapTransition, getSpawnForMap} from "@/utils/mapTransition";
import {Position} from "@/types/movement";
import {Door} from "@/pixi/levels/Door";
import {DoorState} from "@/types/door";
import {TransitionOverlay} from "@/pixi/components/TransitionOverlay";
import {getMapOverlay} from "@/utils/mapOverlay";

interface MainContainerProps {
  canvasSize: {
    width: number;
    height: number
  };
  map: MapKey;
  collisionMap: number[];
  onMapChange: (newMap: MapKey) => void;
  children?: React.ReactNode;
  onMapOverlay: (device: DeviceKey) => void;
}

export const MainContainer = ({
                                canvasSize,
                                map,
                                collisionMap,
                                onMapChange,
                                children,
                                onMapOverlay
                              }: PropsWithChildren<MainContainerProps>) => {
  const [inTransition, setInTransition] = useState(false);
  const [pendingTransition, setPendingTransition] = useState<{to: MapKey, spawn: Position} | null>(null);

  const [shouldSnapCamera, setShouldSnapCamera] = useState(false);
  /**
   * State to track the spawn position of the character.
   */
  const [spawnPosition, setSpawnPosition] = useState<Position>({x: DEFAULT_POS_X, y: DEFAULT_POS_Y});
  /**
   * State to track the character's position in tile coordinates for the camera
   */
  const [characterPosition, setCharacterPosition] = useState({
    x: Math.floor(spawnPosition.x / TILE_SIZE),
    y: Math.floor(spawnPosition.y / TILE_SIZE)
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
                ? {x: spawn.pos.x * TILE_SIZE, y: spawn.pos.y * TILE_SIZE}
                : {x: DEFAULT_POS_X, y: DEFAULT_POS_Y}
      });
      setInTransition(true);
      // if (spawn && spawn.pos) {
      //   const newSpawnPosition = {
      //     x: spawn.pos.x * TILE_SIZE,
      //     y: spawn.pos.y * TILE_SIZE
      //   }
      //   setSpawnPosition(newSpawnPosition);
      //   pos = newSpawnPosition;
      // } else {
      //   const newSpawnPosition = {
      //     x: DEFAULT_POS_X,
      //     y: DEFAULT_POS_Y
      //   }
      //   setSpawnPosition(newSpawnPosition);
      //   pos = newSpawnPosition;
      // }
      setShouldSnapCamera(true);
    }

    const overlay = getMapOverlay(map, tileX, tileY);

    if (overlay){
      onMapOverlay?.(overlay.device);
    }

    updateCharacterPosition(pos);
  };

  return (
          <>
            <Container>
              <Graphics
                      draw={g => {
                        g.clear();
                        g.beginFill(0x38373a);
                        g.drawRect(0, 0, canvasSize.width, canvasSize.height);
                        g.endFill();
                      }}
              />
              {children}
              <Camera key={map}
                      characterPosition={characterPosition}
                      canvasSize={canvasSize}
                      shouldSnap={shouldSnapCamera}
                      onSnapComplete={() => setShouldSnapCamera(false)}
              >
                <Level texture={levelTexture}/>
                <Character
                        texture={characterTexture}
                        onMove={handleCharacterMove}
                        collisionMap={collisionMap}
                        spawnPosition={spawnPosition}
                />
                <LevelOverlay texture={overlayTexture} />
                <Door textures={doorTexture} state={DoorState.Open}/>
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
            </Container>
          </>
  );
}