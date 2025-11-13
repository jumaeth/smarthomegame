import {RoomWrapper} from "@/components/rooms/RoomWrapper";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement";
import {RoomNames} from "@/objects/RoomNames";
import {InteractiveType} from "@/types/InteractiveType";
import {SmartHomeHub} from "@/components/smart-devices/SmartHomeHub";
import {SmartKitchen} from "@/components/smart-devices/SmartKitchen";
import {SecurityCamera} from "@/components/smart-devices/SecurityCamera";

export const Kitchen = () => {
  const interactiveElements = [
    new InteractivePixiElement(14, 4, 1, 1, "SmartHomeHub", InteractiveType.SMART_DEVICE),
    new InteractivePixiElement(1, 3, 1, 1, "SecurityCamera", InteractiveType.SMART_DEVICE),
    new InteractivePixiElement(9, 3, 1, 1, "SmartKitchen", InteractiveType.SMART_DEVICE),
    new InteractivePixiElement(5, 1.7, 1, 1.3, "KitchenPainting", InteractiveType.DUMMY),
  ];

  const deviceComponents = {
    SmartHomeHub: <SmartHomeHub/>,
    SmartKitchen: <SmartKitchen/>,
    SecurityCamera: <SecurityCamera/>,
  };

  return (
          <RoomWrapper
                  roomName={RoomNames.KITCHEN}
                  interactiveElements={interactiveElements}
                  deviceComponents={deviceComponents}
          />
  );
};
