import {useMemo} from 'react';
import {MapKey} from '@/types/maps';
import {LEVEL_TEXTURES} from '@/pixi/constants/levels/level-textures';
import {loadTexture} from '@/utils/loadTexture';
import {Texture} from "@pixi/core";

export function useLevelTextures(map: MapKey) {
  const toTextures = (arr?: (string | undefined)[]): Texture[] =>
          (arr ?? []).filter((s): s is string => !!s).map((s) => loadTexture(s, 0));
  return useMemo(() => {
    const { level, overlay, doorFloor, doorFrameFront, doorFrameBack } = LEVEL_TEXTURES[map];
    const doorFloorTextures = doorFloor ? toTextures(doorFloor) : undefined;
    const doorFrameFrontTextures = toTextures(doorFrameFront);
    const doorFrameBackTextures  = toTextures(doorFrameBack);
    return {
      levelTexture: loadTexture(level),
      overlayTexture: loadTexture(overlay),
      doorFloorTexture: doorFloorTextures,
      doorFrameFrontTexture: doorFrameFrontTextures,
      doorFrameBackTexture: doorFrameBackTextures
    };
  }, [map]);
}