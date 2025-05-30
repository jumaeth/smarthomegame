import {PropsWithChildren, useCallback, useMemo, useState} from "react";
import {Container, Graphics} from "@pixi/react";
import {Level} from "@/pixi/levels/Level";
import characterImage from "@/assets/character/character_movement.png";
import levelImage from "@/assets/levels/livingroom/livingroom.png";
import levelOverlayImage from "@/assets/levels/livingroom/livingroom_overlay.png";
import {Character} from "@/pixi/character/Character";
import {TILE_SIZE} from "@/pixi/constants/world-settings";
import {Camera} from "@/pixi/camera/Camera";
import {LevelOverlay} from "@/pixi/levels/LevelOverlay";
import {loadTexture} from "@/utils/loadTexture";

interface MainContainerProps {
  canvasSize: {
    width: number;
    height: number
  };
}

export const MainContainer = ({canvasSize, children}: PropsWithChildren<MainContainerProps>) => {
  const [characterPosition, setCharacterPosition] = useState({x:0, y:0})

  const updateCharacterPosition = useCallback((x: number, y: number) => {
    setCharacterPosition({
      x:Math.floor(x/TILE_SIZE),
      y:Math.floor(y/TILE_SIZE),
    });
  }, [])

  const levelTexture = useMemo(() => loadTexture(levelImage), []);
  const levelOverlayTexture = useMemo(() => loadTexture(levelOverlayImage), []);
  const characterTexture = useMemo(() => loadTexture(characterImage), []);

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
                <Character  texture={characterTexture} onMove={updateCharacterPosition}/>
                <LevelOverlay texture={levelOverlayTexture} />
              </Camera>
            </Container>
          </>
  );
}