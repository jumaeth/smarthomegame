import {useRef, PropsWithChildren, useEffect} from 'react'
import {Container, useTick} from '@pixi/react'
import {Graphics as PIXIGraphics} from 'pixi.js'
import {TILE_SIZE, ZOOM} from "@/pixi/constants/world-settings";
import {lerp} from "@/utils/character/movment.ts";

interface CameraProps {
  characterPosition: { x: number; y: number }
  canvasSize: { width: number; height: number }
  shouldSnap: boolean;
  onSnapComplete: () => void;
  tutorialEnabled: boolean;
}

export const Camera = ({
                         characterPosition,
                         canvasSize,
                         shouldSnap,
                         onSnapComplete,
                         children,
                         tutorialEnabled
                       }: PropsWithChildren<CameraProps>) => {
  const containerRef = useRef<PIXIGraphics>(null)

  const cameraPosition = useRef<{ x: number; y: number }>({
    x: canvasSize.width / 2,
    y: canvasSize.height / 2,
  })

  const computeTarget = () => {
    const targetX = canvasSize.width * 0.7 - characterPosition.x * TILE_SIZE * ZOOM - TILE_SIZE
    const targetY = canvasSize.height * 0.5 - characterPosition.y * TILE_SIZE * ZOOM - TILE_SIZE
    return { x: targetX, y: targetY }
  }

  useEffect(() => {
    if (!containerRef.current || !tutorialEnabled) return
    const { x, y } = computeTarget()
    cameraPosition.current.x = x
    cameraPosition.current.y = y
    containerRef.current.x = x
    containerRef.current.y = y
  }, [])

  useTick(() => {
    if (!containerRef.current) return;

    const targetX = canvasSize.width / 2 - characterPosition.x * TILE_SIZE * ZOOM - TILE_SIZE;
    const targetY = canvasSize.height / 2 - characterPosition.y * TILE_SIZE * ZOOM - TILE_SIZE;

    if (shouldSnap) {
      cameraPosition.current.x = targetX;
      cameraPosition.current.y = targetY;
      containerRef.current.x = targetX;
      containerRef.current.y = targetY;
      onSnapComplete();
    } else {
      cameraPosition.current.x = lerp(cameraPosition.current.x, targetX);
      cameraPosition.current.y = lerp(cameraPosition.current.y, targetY);
      containerRef.current.x = cameraPosition.current.x;
      containerRef.current.y = cameraPosition.current.y;
    }
  });

  return (
          <Container ref={containerRef} scale={ZOOM}>
            {children}
          </Container>
  )
}
