import {RoomWrapper} from "@/components/rooms/RoomWrapper";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement";
import {RoomNames} from "@/objects/RoomNames";
import {InteractiveType} from "@/types/InteractiveType";
import SmartMirror from "@/components/smart-devices/SmartMirror.tsx";

export const Bedroom = () => {
  const interactiveElements = [
    new InteractivePixiElement(1, 6, 2, 2, "SmartMirror", InteractiveType.SMART_DEVICE),
    new InteractivePixiElement(12, 3, 1, 0.5, "BedroomFish", InteractiveType.DUMMY),
    new InteractivePixiElement(15, 4, 1, 0.5, "BedroomChildBed", InteractiveType.DUMMY),
    new InteractivePixiElement(6, 2, 1.85, 1.9, "BedroomWardrobe", InteractiveType.DUMMY),
    new InteractivePixiElement(1.05, 2.4, 0.85, 0.8, "BedroomRadio", InteractiveType.DUMMY),
  ];

  const deviceComponents = {
    SmartMirror: <SmartMirror/>,
  };

  return (
          <RoomWrapper
                  roomName={RoomNames.BEDROOM}
                  interactiveElements={interactiveElements}
                  deviceComponents={deviceComponents}
          />
  );
};
