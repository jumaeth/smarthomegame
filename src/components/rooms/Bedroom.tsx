import {RoomWrapper} from "@/components/rooms/RoomWrapper";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement";
import {RoomNames} from "@/objects/RoomNames";
import {InteractiveType} from "@/types/InteractiveType";
import SmartMirror from "@/components/smart-devices/SmartMirror.tsx";

export const Bedroom = () => {
  const interactiveElements = [
    new InteractivePixiElement(1, 5, 2, 2, "SmartMirror", InteractiveType.SMART_DEVICE),
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
