import livingroomImg from '@/assets/levels/livingroom/livingroom.png';
import livingroomOverlayImg from '@/assets/levels/livingroom/livingroom_overlay.png';
import kitchenImg from '@/assets/levels/kitchen/kitchen.png';
import kitchenOverlayImg from '@/assets/levels/kitchen/kitchen_overlay.png';
import defaultDoorClosedImg from '@/assets/levels/doors/door_closed.png';
import defaultDoorHalfOpenImg from '@/assets/levels/doors/door_half_open.png';
import defaultDoorOpenImg from '@/assets/levels/doors/door_open.png';
import hallwayImg from '@/assets/levels/hallway/hallway.png';
import hallwayOverlayImg from '@/assets/levels/hallway/hallway_overlay.png';
import bathroomImg from '@/assets/levels/bathroom/bathroom.png';
import bathroomOverlayImg from '@/assets/levels/bathroom/bathroom_overlay.png';

import hallwayLivingRoomDoorClosedImg
  from '@/assets/levels/hallway/doors/to_livingroom/frame/hallway_to_living_room_frame_closed.png';
import hallwayLivingRoomDoorHalfOpenImg
  from '@/assets/levels/hallway/doors/to_livingroom/frame/hallway_to_living_room_frame_half_open.png';
import hallwayLivingRoomDoorOpenImg
  from '@/assets/levels/hallway/doors/to_livingroom/frame/hallway_to_living_room_frame_open.png';

import hallwayKitchenDoorClosedImg
  from '@/assets/levels/hallway/doors/to_kitchen/frame/hallway_to_kitchen_frame_closed.png';
import hallwayKitchenDoorHalfOpenImg
  from '@/assets/levels/hallway/doors/to_kitchen/frame/hallway_to_kitchen_frame_half_open.png';
import hallwayKitchenDoorOpenImg
  from '@/assets/levels/hallway/doors/to_kitchen/frame/hallway_to_kitchen_frame_open.png';

import hallwayBathroomDoorClosedImg
  from '@/assets/levels/hallway/doors/to_bathroom/frame/hallway_to_bathroom_frame_closed.png';
import hallwayBathroomDoorHalfOpenImg
  from '@/assets/levels/hallway/doors/to_bathroom/frame/hallway_to_bathroom_frame_half_open.png';
import hallwayBathroomDoorOpenImg
  from '@/assets/levels/hallway/doors/to_bathroom/frame/hallway_to_bathroom_frame_open.png';

import livingRoomFloorImg from '@/assets/levels/hallway/doors/to_livingroom/floor/hallway_to_living_room_floor.png';
import kitchenFloorImg from '@/assets/levels/hallway/doors/to_kitchen/floor/hallway_to_kitchen_floor.png';
import bathroomFloorImg from '@/assets/levels/hallway/doors/to_bathroom/floor/hallway_to_bathroom_floor.png';

interface RoomTextures {
  level: string;
  overlay: string;
  doorFloor?: string[];
  doorFrameFront?: string[];
  doorFrameBack?: string[];
}

export const LEVEL_TEXTURES = {
  livingroom: {
    level: livingroomImg as string,
    overlay: livingroomOverlayImg as string,
    doorFrameFront: [defaultDoorClosedImg, defaultDoorHalfOpenImg, defaultDoorOpenImg] as string[]
  } as RoomTextures,

  kitchen: {
    level: kitchenImg as string,
    overlay: kitchenOverlayImg as string,
    doorFrameFront: [defaultDoorClosedImg, defaultDoorHalfOpenImg, defaultDoorOpenImg] as string[],
  } as RoomTextures,

  hallway: {
    level: hallwayImg as string,
    overlay: hallwayOverlayImg as string,
    doorFloor: [livingRoomFloorImg, kitchenFloorImg, bathroomFloorImg] as string[],
    doorFrameFront: [hallwayLivingRoomDoorClosedImg, hallwayLivingRoomDoorHalfOpenImg, hallwayLivingRoomDoorOpenImg,
              hallwayKitchenDoorClosedImg, hallwayKitchenDoorHalfOpenImg, hallwayKitchenDoorOpenImg] as string[],
    doorFrameBack: [hallwayBathroomDoorClosedImg, hallwayBathroomDoorHalfOpenImg, hallwayBathroomDoorOpenImg] as string[]
  } as RoomTextures,

  bathroom: {
    level: bathroomImg as string,
    overlay: bathroomOverlayImg as string,
    doorFrameFront: [defaultDoorClosedImg, defaultDoorHalfOpenImg, defaultDoorOpenImg] as string[],
  } as RoomTextures,

};