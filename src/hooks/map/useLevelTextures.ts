import { useMemo } from 'react';
import { MapKey } from '@/types/maps';
import { LEVEL_TEXTURES } from '@/pixi/constants/levels/level-textures';
import { loadTexture } from '@/utils/loadTexture';

export function useLevelTextures(map: MapKey) {
  return useMemo(() => {
    const { level, overlay, door } = LEVEL_TEXTURES[map];
    const doorTextures = door ? door.map(loadTexture) : undefined;
    return {
      levelTexture: loadTexture(level),
      overlayTexture: loadTexture(overlay),
      doorTexture: doorTextures,
    };
  }, [map]);
}