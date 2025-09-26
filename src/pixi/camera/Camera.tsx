import {useRef, PropsWithChildren, useEffect} from 'react'
import {Container, useTick} from '@pixi/react'
import {Container as PIXIContainer} from 'pixi.js'
import {TILE_SIZE, ZOOM} from "@/pixi/constants/world-settings";
import {lerp} from "@/utils/movment";

interface CameraProps {
  characterPosition: { x: number; y: number }
  canvasSize: { width: number; height: number }
  shouldSnap: boolean;
  onSnapComplete: () => void;
}

export const Camera = ({
                         characterPosition,
                         canvasSize,
                         shouldSnap,
                         onSnapComplete,
                         children,
                       }: PropsWithChildren<CameraProps>) => {
  const containerRef = useRef<PIXIContainer>(null)

  const cameraPosition = useRef<{ x: number; y: number }>({
    x: canvasSize.width / 2,
    y: canvasSize.height / 2,
  })

  const computeTarget = () => {
    const cx = canvasSize.width  / 2
    const cy = canvasSize.height / 2
    const tx = cx - (characterPosition.x * TILE_SIZE + TILE_SIZE / 2) * ZOOM
    const ty = cy - (characterPosition.y * TILE_SIZE + TILE_SIZE / 2) * ZOOM
    // whole pixels to avoid jitter
    return { x: Math.round(tx), y: Math.round(ty) }
  }

  useEffect(() => {
    if (!containerRef.current) return
    const { x, y } = computeTarget()
    cameraPosition.current.x = x
    cameraPosition.current.y = y
    containerRef.current.x = x
    containerRef.current.y = y
  }, [canvasSize.width, canvasSize.height, computeTarget])

  useTick(() => {
    if (!containerRef.current) return

    const { x: targetX, y: targetY } = computeTarget()

    if (shouldSnap) {
      cameraPosition.current.x = targetX
      cameraPosition.current.y = targetY
      containerRef.current.x = targetX
      containerRef.current.y = targetY
      onSnapComplete()
    } else {
      cameraPosition.current.x = lerp(cameraPosition.current.x, targetX)
      cameraPosition.current.y = lerp(cameraPosition.current.y, targetY)
      containerRef.current.x = cameraPosition.current.x
      containerRef.current.y = cameraPosition.current.y
    }
  })

  return (
          <Container ref={containerRef} scale={ZOOM}>
            {children}
          </Container>
  )
}
