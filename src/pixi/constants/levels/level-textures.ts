import livingroomImg from '@/assets/levels/livingroom/livingroom.png';
import livingroomOverlayImg from '@/assets/levels/livingroom/livingroom_overlay.png';
import kitchenImg from '@/assets/levels/kitchen/kitchen.png';
import kitchenOverlayImg from '@/assets/levels/kitchen/kitchen_overlay.png';
import kitchenDoorClosedImg from '@/assets/levels/kitchen/kitchen_door_closed.png';
import kitchenDoorHalfOpenImg from '@/assets/levels/kitchen/kitchen_door_half_open.png';
import kithenDoorOpenImg from '@/assets/levels/kitchen/kitchen_door_open.png';
import hallwayImg from '@/assets/levels/hallway/hallway.png';
import hallwayOverlayImg from '@/assets/levels/hallway/hallway_overlay.png';
import bathroomImg from '@/assets/levels/bathroom/bathroom.png';
import bathroomOverlayImg from '@/assets/levels/bathroom/bathroom_overlay.png';

import { MapKey } from '@/types/maps';

export const LEVEL_TEXTURES: Record<MapKey, { level: string; overlay: string, door?: string[] }> = {
  livingroom: { level: livingroomImg, overlay: livingroomOverlayImg},
  kitchen: { level: kitchenImg, overlay: kitchenOverlayImg, door: [kitchenDoorClosedImg, kitchenDoorHalfOpenImg, kithenDoorOpenImg]},
  hallway: { level: hallwayImg, overlay: hallwayOverlayImg },
  bathroom: { level: bathroomImg, overlay: bathroomOverlayImg },
};