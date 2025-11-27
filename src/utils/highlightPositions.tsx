import {loadTexture} from "@/utils/loadTexture.ts";
import tv from "@/assets/highlighting/tv.png";
import lamp from "@/assets/highlighting/lamp.png";
import camera from "@/assets/highlighting/camera.png";
import hub from "@/assets/highlighting/hub.png";
import kitchen from "@/assets/highlighting/kitchen.png";
import mirror from "@/assets/highlighting/mirror.png";
import hallway_frog from "@/assets/highlighting/extras/hallway_frog.png";
import hallway_pets from "@/assets/highlighting/extras/hallway_pets.png"
import hallway_entry_door from "@/assets/highlighting/extras/hallway_entry_door.png"
import livingroom_candles from "@/assets/highlighting/extras/livingroom_candles.png"
import livingroom_food from "@/assets/highlighting/extras/livingroom_food.png"
import kitchen_painting from "@/assets/highlighting/extras/kitchen_painting.png"
import bathroom_chick from "@/assets/highlighting/extras/bathroom_chick.png"
import bathroom_drawer from "@/assets/highlighting/extras/bathroom_drawer.png"
import bathroom_toilet from "@/assets/highlighting/extras/bathroom_toilet.png"
import bedroom_fish from "@/assets/highlighting/extras/bedroom_fish.png"
import bedroom_child_bed from "@/assets/highlighting/extras/bedroom_child_bed.png"
import bedroom_wardrobe from "@/assets/highlighting/extras/bedroom_wardrobe.png"
import bedroom_radio from "@/assets/highlighting/extras/bedroom_radio.png"
import smart_shower from "@/assets/highlighting/shower.png"
import {Container, Graphics, Sprite} from "@pixi/react";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";

export function getHighlightPosition(device: InteractivePixiElement, position: {x: number, y: number}){

  switch (device.name){
    case "SmartTv":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x + TILE_SIZE * 8.75}
                        y={position.y + TILE_SIZE * 5.525}
                        texture={loadTexture(tv as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )
    case "SmartLights":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x + TILE_SIZE * 8.94}
                        y={position.y + TILE_SIZE * 5.53}
                        texture={loadTexture(lamp as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )
    case "SecurityCamera":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x + TILE_SIZE * 8.94}
                        y={position.y + TILE_SIZE * 5.46}
                        texture={loadTexture(camera as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )
    case "SmartHomeHub":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x + TILE_SIZE * 8.12}
                        y={position.y + TILE_SIZE * 5.41}
                        texture={loadTexture(hub as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )
    case "SmartKitchen":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x + TILE_SIZE * 8.45}
                        y={position.y + TILE_SIZE * 5.45}
                        texture={loadTexture(kitchen as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )
    case "SmartMirror":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x + TILE_SIZE * 8.93}
                        y={position.y + TILE_SIZE * 5.27}
                        texture={loadTexture(mirror as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    case "SmartShower":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x + TILE_SIZE * 8.93}
                        y={position.y + TILE_SIZE * 5.46}
                        texture={loadTexture(smart_shower as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    //--extras--

    case "HallwayFrog":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x + TILE_SIZE * 12.4775}
                        y={position.y + TILE_SIZE * 8.065}
                        texture={loadTexture(hallway_frog as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      );

    case "HallwayPets":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x * TILE_SIZE + TILE_SIZE * 11.5}
                        y={position.y *TILE_SIZE - TILE_SIZE * 2.85 }
                        texture={loadTexture(hallway_pets as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    case "HallwayEntryDoor":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x * TILE_SIZE + TILE_SIZE * 9.5}
                        y={position.y *TILE_SIZE + TILE_SIZE * 6.65 }
                        texture={loadTexture(hallway_entry_door as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )


    case "LivingRoomCandles":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x  + TILE_SIZE * 8.44}
                        y={position.y + TILE_SIZE * 5.324}
                        texture={loadTexture(livingroom_candles as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    case "LivingRoomFood":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x  + TILE_SIZE * 8.005}
                        y={position.y + TILE_SIZE * 5.34}
                        texture={loadTexture(livingroom_food as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    case "KitchenPainting":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x  + TILE_SIZE * 8.68}
                        y={position.y + TILE_SIZE * 5.54}
                        texture={loadTexture(kitchen_painting as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    case "BathroomChick":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x  + TILE_SIZE * 8.065}
                        y={position.y + TILE_SIZE * 5.245}
                        texture={loadTexture(bathroom_chick as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    case "BathroomDrawer":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x  + TILE_SIZE * 8.9255}
                        y={position.y + TILE_SIZE * 5.245}
                        texture={loadTexture(bathroom_drawer as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    case "BathroomToilet":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x  * TILE_SIZE - TILE_SIZE * 6.015}
                        y={position.y + TILE_SIZE * 5.49}
                        texture={loadTexture(bathroom_toilet as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    case "BedroomFish":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x  + TILE_SIZE * 8.25}
                        y={position.y + TILE_SIZE * 5.46}
                        texture={loadTexture(bedroom_fish as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    case "BedroomChildBed":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x  + TILE_SIZE * 8.065}
                        y={position.y + TILE_SIZE * 5.4}
                        texture={loadTexture(bedroom_child_bed as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    case "BedroomWardrobe":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x  + TILE_SIZE * 8.625}
                        y={position.y + TILE_SIZE * 5.525}
                        texture={loadTexture(bedroom_wardrobe as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    case "BedroomRadio":
      return (
              <>
                <Sprite
                        key={device.name + "highlight"}
                        x={position.x  + TILE_SIZE * 8.93}
                        y={position.y + TILE_SIZE * 5.505}
                        texture={loadTexture(bedroom_radio as string)}
                        scale={{ x: 1, y: 1 }}
                        anchor={0.5}
                />
              </>
      )

    default:
      return (
              <Container>
                <Graphics
                        draw={(g) => {
                          g.clear();
                          g.lineStyle(1, 0xFFFF00, 0.5);
                          g.drawRoundedRect(
                                  device.x * TILE_SIZE,
                                  device.y * TILE_SIZE,
                                  device.width * TILE_SIZE,
                                  device.height * TILE_SIZE,
                                  1
                          );
                          g.endFill();
                        }}
                />
              </Container>
      )
  }
}