import {Stage} from "@pixi/react";
import {useCallback, useEffect, useState} from "react";
import {calculateCanvasSize} from "@/utils/movment";
import {MainContainer} from "@/pixi/container/MainContainer";
import {IntroContainer} from "@/pixi/container/IntroContainer";
import {MapKey} from "@/types/maps";
import {LEVEL_COLLISION_MAPS} from "@/pixi/constants/levels/level-collision-maps";

interface MainStageProps {
  triggerOverlay: () => void;
}

export const MainStage = ({ triggerOverlay }: MainStageProps) => {
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());
  const [showIntro, setShowIntro] = useState(true);
  const [currentMap, setCurrentMap] = useState<MapKey>('livingroom');
  const collisionMap = LEVEL_COLLISION_MAPS[currentMap];

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, [])

  const handleMapChange = (newMap: MapKey) => {
    setCurrentMap(newMap);
  };

  const handleMapOverlay = () => {
    triggerOverlay();
  }

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    }
  }, [updateCanvasSize, collisionMap])

  return (
    <>
      <Stage width={canvasSize.width} height={canvasSize.height}>
        {showIntro ? (
                <IntroContainer
                        canvasSize={canvasSize}
                        onStart={() => setShowIntro(false)}
                />
        ) : (
                <MainContainer
                        canvasSize={canvasSize}
                        map={currentMap}
                        collisionMap={collisionMap}
                        onMapChange={handleMapChange}
                        onMapOverlay={handleMapOverlay}
                />
        )}
      </Stage>
    </>
  );
}