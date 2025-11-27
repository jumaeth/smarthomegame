import {RoomNames} from "@/objects/RoomNames";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement";
import {InteractiveType} from "@/types/InteractiveType";
import {useNavigate} from "react-router-dom";
import {MapKey} from "@/types/maps";
import {RoomWrapper} from "@/components/rooms/RoomWrapper.tsx";

export const Hallway = () => {
  const navigate = useNavigate();

  const interactiveElements = [
    new InteractivePixiElement(16.25, 9.5, 0.5, 1, "HallwayFrog", InteractiveType.DUMMY),
    new InteractivePixiElement(2, 11.5, 1, 2, "HallwayPets", InteractiveType.DUMMY),
    new InteractivePixiElement(4, 2, 1, 1, "HallwayEntryDoor", InteractiveType.DUMMY),
  ];

  const handleMapChange = (newMap: MapKey) => {
    navigate(`/game/${newMap}`);
  };

  return (
          <RoomWrapper
                  roomName={RoomNames.HALLWAY}
                  interactiveElements={interactiveElements}
                  autoComplete
                  autoUnlock
                  onMapChangeOverride={handleMapChange}
          />
  );
};
