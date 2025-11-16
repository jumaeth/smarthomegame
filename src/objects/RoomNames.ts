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