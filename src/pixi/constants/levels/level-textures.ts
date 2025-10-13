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

import hallwayLivingRoomDoorClosedImg from '@/assets/levels/hallway/doors/to_livingroom/frame/hallway_to_living_room_frame_closed.png';
import hallwayLivingRoomDoorHalfOpenImg from '@/assets/levels/hallway/doors/to_livingroom/frame/hallway_to_living_room_frame_half_open.png';
import hallwayLivingRoomDoorOpenImg from '@/assets/levels/hallway/doors/to_livingroom/frame/hallway_to_living_room_frame_open.png';

import hallwayKitchenDoorClosedImg from '@/assets/levels/hallway/doors/to_kitchen/frame/hallway_to_kitchen_frame_closed.png';
import hallwayKitchenDoorHalfOpenImg from '@/assets/levels/hallway/doors/to_kitchen/frame/hallway_to_kitchen_frame_half_open.png';
import hallwayKitchenDoorOpenImg from '@/assets/levels/hallway/doors/to_kitchen/frame/hallway_to_kitchen_frame_open.png';

import livingRoomFloorImg from '@/assets/levels/hallway/doors/to_livingroom/floor/hallway_to_living_room_floor.png';
import kitchenFloorImg from '@/assets/levels/hallway/doors/to_kitchen/floor/hallway_to_kitchen_floor.png';

import { MapKey } from '@/types/maps';

export const LEVEL_TEXTURES: Record<MapKey, { level: string; overlay: string, doorFloor?: string[], doorFrame?: string[] }> = {
  livingroom: { level: livingroomImg, overlay: livingroomOverlayImg, doorFrame: [kitchenDoorClosedImg, kitchenDoorHalfOpenImg, kithenDoorOpenImg]},
  kitchen: { level: kitchenImg, overlay: kitchenOverlayImg, doorFrame: [kitchenDoorClosedImg, kitchenDoorHalfOpenImg, kithenDoorOpenImg]},
  hallway: { level: hallwayImg, overlay: hallwayOverlayImg, doorFloor: [livingRoomFloorImg, kitchenFloorImg], doorFrame:
            [hallwayLivingRoomDoorClosedImg, hallwayLivingRoomDoorHalfOpenImg, hallwayLivingRoomDoorOpenImg,
              hallwayKitchenDoorClosedImg, hallwayKitchenDoorHalfOpenImg, hallwayKitchenDoorOpenImg] },
  bathroom: { level: bathroomImg, overlay: bathroomOverlayImg },

};