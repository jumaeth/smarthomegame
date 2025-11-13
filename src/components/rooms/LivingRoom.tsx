import {RoomWrapper} from "@/components/rooms/RoomWrapper";
import {SmartTv} from "../smart-devices/SmartTv";
import {SmartLights} from "../smart-devices/SmartLights";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement";
import {RoomNames} from "@/objects/RoomNames";
import {InteractiveType} from "@/types/InteractiveType";

export const LivingRoom = () => {
  const interactiveElements = [
    new InteractivePixiElement(4, 2, 2, 1, "SmartTv", InteractiveType.SMART_DEVICE),
    new InteractivePixiElement(1, 2, 1, 2, "SmartLights", InteractiveType.SMART_DEVICE),
    new InteractivePixiElement(8.95, 5.225, 1, 1, "LivingRoomCandles", InteractiveType.DUMMY),
    new InteractivePixiElement(16, 5, 1, 1, "LivingRoomFood", InteractiveType.DUMMY),
  ];

  const deviceComponents = {
    SmartTv: <SmartTv/>,
    SmartLights: <SmartLights/>,
  };

  return (
          <RoomWrapper
                  roomName={RoomNames.LIVINGROOM}
                  interactiveElements={interactiveElements}
                  deviceComponents={deviceComponents}
          />
  );
};