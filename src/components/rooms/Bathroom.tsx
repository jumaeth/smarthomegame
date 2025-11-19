import {RoomWrapper} from "@/components/rooms/RoomWrapper";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement";
import {RoomNames} from "@/objects/RoomNames";
import {InteractiveType} from "@/types/InteractiveType";
import {SmartShower} from "@/components/smart-devices/SmartShower.tsx";

export const Bathroom = () => {
  const interactiveElements = [
    new InteractivePixiElement(1, 3, 2, 1, "SmartShower", InteractiveType.SMART_DEVICE),
    new InteractivePixiElement(14.975, 6.5, 1, 1, "BathroomChick", InteractiveType.DUMMY),
    new InteractivePixiElement(1.15, 6.5, 1.6, 1, "BathroomDrawer", InteractiveType.DUMMY),
  ];

  const deviceComponents = {
    SmartShower: <SmartShower/>,
  };

  return (
          <RoomWrapper
                  roomName={RoomNames.BATHROOM}
                  interactiveElements={interactiveElements}
                  deviceComponents={deviceComponents}
          />
  );
};
