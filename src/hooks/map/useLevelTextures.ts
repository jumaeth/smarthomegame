import {useMemo} from 'react';
import {MapKey} from '@/types/maps';
import {LEVEL_TEXTURES} from '@/pixi/constants/levels/level-textures';
import {loadTexture} from '@/utils/loadTexture';
import {RoomNames, roomNameToEnum} from "@/objects/RoomNames.ts";
import {Texture} from "@pixi/core";

export function useLevelTextures(map: MapKey) {
  const roomName = roomNameToEnum(map) ?? RoomNames.LIVINGROOM
  return useMemo(() => {
    const { level, overlay, doorFloor, doorFrameFront, doorFrameBack } = LEVEL_TEXTURES[map];
    const doorFloorTextures = doorFloor ? doorFloor.map(t => loadTexture(t, 0)) : undefined;
    const doorFrameFrontTextures: Texture[] = doorFrameFront ? doorFrameFront.map(t => loadTexture(t, 0)) : [];
    const doorFrameBackTextures: Texture[] = doorFrameBack ? doorFrameBack.map(t => loadTexture(t, 0)) : [];
    return {
      levelTexture: loadTexture(level),
      overlayTexture: loadTexture(overlay),
      doorFloorTexture: doorFloorTextures,
      doorFrameFrontTexture: doorFrameFrontTextures,
      doorFrameBackTexture: doorFrameBackTextures
    };
  }, [map]);
}