import {PropsWithChildren, useCallback, useMemo, useState} from "react";
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

interface MainContainerProps {
  canvasSize: {
    width: number;
    height: number
  };
  map: MapKey;
  collisionMap: number[];
  onMapChange: (newMap: MapKey) => void;
  children?: React.ReactNode;
}

export const MainContainer = ({
                                canvasSize,
                                map,
                                collisionMap,
                                onMapChange,
                                children
                              }: PropsWithChildren<MainContainerProps>) => {
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
      onMapChange(transition.to);
      const spawn = getSpawnForMap(transition.to, map);
      if (spawn && spawn.pos) {
        const newSpawnPosition = {
          x: spawn.pos.x * TILE_SIZE,
          y: spawn.pos.y * TILE_SIZE
        }
        setSpawnPosition(newSpawnPosition);
        pos = newSpawnPosition;
      } else {
        const newSpawnPosition = {
          x: DEFAULT_POS_X,
          y: DEFAULT_POS_Y
        }
        setSpawnPosition(newSpawnPosition);
        pos = newSpawnPosition;
      }
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
              <Camera characterPosition={characterPosition} canvasSize={canvasSize}>
                <Level texture={levelTexture}/>
                <Character
                        texture={characterTexture}
                        onMove={handleCharacterMove}
                        collisionMap={collisionMap}
                        spawnPosition={spawnPosition}
                />
                <LevelOverlay texture={overlayTexture} />
                {/*TODO: Fix door texture alignement*/}
                {/*<Door textures={doorTexture} state={DoorState.Closed}/>*/}
              </Camera>
            </Container>
          </>
  );
}