import { t } from "@lingui/core/macro";

export enum RoomNames {
  LIVINGROOM = "livingroom",
  HALLWAY = "hallway",
  KITCHEN = "kitchen",
  BATHROOM = "bathroom",
  BEDROOM = "bedroom"
}

export function roomNameToEnum(roomName: string): RoomNames | undefined {
  for (const key in RoomNames) {
    if (RoomNames[key as keyof typeof RoomNames] === roomName.toLowerCase()) {
      return RoomNames[key as keyof typeof RoomNames];
    }
  }
  return undefined;
}

export const roomDisplayName:Record<RoomNames, () => string> = {
  [RoomNames.LIVINGROOM]: () => t`Living Room`,
  [RoomNames.HALLWAY]: () => t`Hallway`,
  [RoomNames.KITCHEN]: () => t`Kitchen`,
  [RoomNames.BATHROOM]: () => t`Bathroom`,
  [RoomNames.BEDROOM]: () => t`Bedroom`
};