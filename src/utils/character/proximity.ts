import { InteractivePixiElement } from "@/objects/InteractivePixiElement";

/**
 * Checks whether the player is within 1 tile of any interactive element.
 * @param player - The player's current tile coordinates.
 * @param elements - The list of interactive elements on the map.
 * @returns The first nearby element, or null if none are nearby.
 */
export function getNearbyInteractiveElement(
        player: { x: number; y: number },
        elements: InteractivePixiElement[] | undefined
): InteractivePixiElement | null {
  if (elements === undefined) return null;
  for (const el of elements) {
    // Define the expanded bounding box (1 tile around the object)
    const left = el.x - 1;
    const right = el.x + el.width;
    const top = el.y - 1;
    const bottom = el.y + el.height;

    const isNear =
            player.x >= left &&
            player.x <= right &&
            player.y >= top &&
            player.y <= bottom;

    if (isNear) {
      return el;
    }
  }

  return null;
}