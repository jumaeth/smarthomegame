import { useMemo } from 'react';
import { MapKey } from '@/types/maps';
import { LEVEL_TEXTURES } from '@/pixi/constants/levels/level-textures';
import { loadTexture } from '@/utils/loadTexture';

export function useLevelTextures(map: MapKey) {
  return useMemo(() => {
    const { level, overlay, doorFloor, doorFrame } = LEVEL_TEXTURES[map];
    const doorFloorTextures = doorFloor ? doorFloor.map(t => loadTexture(t, 0)) : undefined;
    const doorFrameTextures = doorFrame ? doorFrame.map(t => loadTexture(t, 0)) : undefined;
    return {
      levelTexture: loadTexture(level),
      overlayTexture: loadTexture(overlay),
      doorFloorTexture: doorFloorTextures,
      doorFrameTexture: doorFrameTextures
    };
  }, [map]);
}