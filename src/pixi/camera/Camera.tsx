import { useRef, PropsWithChildren } from 'react'
import { Container, useTick } from '@pixi/react'
import { Graphics as PIXIGraphics } from 'pixi.js'
import {TILE_SIZE, ZOOM} from "@/pixi/constants/world-settings";
import {lerp} from "@/utils/movment";

interface CameraProps {
  characterPosition: { x: number; y: number }
  canvasSize: { width: number; height: number }
}

export const Camera = ({
                         characterPosition,
                         canvasSize,
                         children,
                       }: PropsWithChildren<CameraProps>) => {
  const containerRef = useRef<PIXIGraphics>(null)

  const cameraPosition = useRef<{ x: number; y: number }>({
    x: canvasSize.width / 2,
    y: canvasSize.height / 2,
  })

  useTick(() => {
    if (containerRef.current) {
      const targetX =
              canvasSize.width / 2 - characterPosition.x * TILE_SIZE * ZOOM - TILE_SIZE
      const targetY =
              canvasSize.height / 2 - characterPosition.y * TILE_SIZE * ZOOM - TILE_SIZE

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