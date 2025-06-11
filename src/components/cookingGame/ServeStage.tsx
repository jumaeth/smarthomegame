import {Sprite, Text, Graphics} from 'pixi.js';
import {extend} from "@pixi/react";
import {useEffect, useRef, useState} from "react";
import {useLoadTextures} from "../../hooks/useLoadTextures.tsx";
import {useTypingText} from "../../hooks/useTypingText.tsx";
import {Button} from "./Button.tsx";

extend({ Sprite, Text, Graphics });

export const ServeStage = ({setStage, dimensions, setTotalPoints}) => {
  const [showButton, setShowButton] = useState(false);
  const [hovered, setHovered] = useState("");
  const [dragged, setDragged] = useState("");
  const [spriteToMarkerMap, setSpriteToMarkerMap] = useState({});
  const [lockedSprites, setLockedSprites] = useState({});
  const [page, setPage] = useState(1);
  const [points, setPoints] = useState(100);

  const draggingRef = useRef(false);

  const instruction = "We are nearly there! \n\nIn a final step we have to set the table and plate our meal.";

  const texturePaths = {
    recipeopen: "/cooking-sprites/recipeopen.png",
    tableBackground: "/cooking-sprites/table_background.png",
    placemat: "/cooking-sprites/placemat.png",
    plate: "/cooking-sprites/plate_with_food.png",
    cutlery: "/cooking-sprites/cutlery.png",
    glas: "/cooking-sprites/glas.png",
    napkin: "/cooking-sprites/napkin.png",
    spoon: "/cooking-sprites/spoon.png",
  };

  const  initialPositions = useRef({
    plate: { x: 60, y: 50 },
    cutlery: { x: 160, y: 50 },
    glas: { x: 260, y: 50 },
    napkin: {x: 360, y: 50},
    spoon: {x: 460, y: 50}
  });

  type Marker = {
    x: number;
    y: number;
    expecting: string | null;
    alpha: number;
    id: string;
    filled: boolean;
  };

  const [markerPositions, setMarkerPositions] = useState<Marker[]>([
    { x: initialPositions.current.plate.x, y: initialPositions.current.plate.y, expecting: null, alpha: 1, id: "1", filled: false },
    { x: initialPositions.current.cutlery.x, y: initialPositions.current.cutlery.y, expecting: null, alpha: 1, id: "2", filled: false },
    { x: initialPositions.current.glas.x, y: initialPositions.current.glas.y, expecting: null, alpha: 1, id: "3", filled: false },
    { x: initialPositions.current.napkin.x, y: initialPositions.current.napkin.y, expecting: null, alpha: 1, id: "4", filled: false },
    { x: initialPositions.current.spoon.x, y: initialPositions.current.spoon.y, expecting: null, alpha: 1, id: "5", filled: false },
    { x: 265, y: 225, expecting: "plate", alpha: 1, id: "plate", filled: false },
    { x: 355, y: 230, expecting: "cutlery", alpha: 1, id: "cutlery", filled: false },
    { x: 355, y: 140, expecting: "glas", alpha: 1, id: "glas", filled: false },
    { x: 180, y: 220, expecting: "napkin", alpha: 1, id: "napkin", filled: false },
    { x: 270, y: 170, expecting: "spoon", alpha: 1, id: "spoon", filled: false },
  ]);

  const setMarkerAlpha = (id : string, alpha: number) => {
    setMarkerPositions(prev => prev.map(m => m.id === id ? { ...m, alpha } : m));
  };

  const setMarkerFilled = (id: string, filled: boolean) => {
    setMarkerPositions(prev => prev.map(m => m.id === id ? { ...m, filled } : m));
  };

  const initialMarkerMap = useRef<{ [spriteId: string]: string }>({
    plate: "1",
    cutlery: "2",
    glas: "3",
    napkin: "4",
    spoon: "4"
  });

  const {textures} = useLoadTextures(texturePaths);
  const { typedText, typingDone, showCursor } = useTypingText(instruction, 35);

  useEffect(() => {
    if (typingDone) {
      const delay = setTimeout(() => setShowButton(true), 500);
      return () => clearTimeout(delay);
    } else {
      setShowButton(false);
    }
  }, [typingDone]);

  const drawMarker = (g, marker) => {
    g.clear();
    g.fill( 0xeeeeee, marker.alpha);
    g.lineStyle(marker.alpha === 0 ? 0 : 1, 0x000000);
    g.drawRoundedRect(0, 0, 20, 20, 2);
    g.endFill();
  };

  const plate = { id: "plate", scale: 0.1,  texture: textures.plate, x: initialPositions.current.plate.x, y: initialPositions.current.plate.y, anchor: {x: 0.4, y: 0.4} };
  const cutlery = { id: "cutlery", scale: 0.08,  texture: textures.cutlery, x: initialPositions.current.cutlery.x, y: initialPositions.current.cutlery.y, anchor: {x: 0.4, y: 0.4} };
  const glas = { id: "glas", scale: 0.09, texture: textures.glas, x: initialPositions.current.glas.x, y: initialPositions.current.glas.y, anchor: {x: 0.4, y: 0.4} };
  const napkin = { id: "napkin", scale: 0.08,  texture: textures.napkin, x: initialPositions.current.napkin.x, y: initialPositions.current.napkin.y, anchor: {x: 0.5, y: 0.45} };
  const spoon = { id: "spoon", scale: 0.07,  texture: textures.spoon, x: initialPositions.current.spoon.x, y: initialPositions.current.spoon.y, anchor: {x: 0.45, y: 0.38} };


  const renderElements = [plate, cutlery, glas, napkin, spoon];
  const spriteRefs = useRef({});
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const onDragStart = (e, id) => {
    if (lockedSprites[id]) return;
    draggingRef.current = true;
    const sprite = spriteRefs.current[id];
    if (!sprite) return;
    const pos = e.data.getLocalPosition(sprite.parent);
    setDragOffset({ x: pos.x - sprite.x, y: pos.y - sprite.y });

    const previousMarkerId = spriteToMarkerMap[id];
    if (previousMarkerId) setMarkerFilled(previousMarkerId, false);

    setDragged(id);
    e.stopPropagation();
  };

  const onDragMove = (e) => {
    if (!dragged || !spriteRefs.current[dragged]) return;
    const sprite = spriteRefs.current[dragged];
    const pos = e.data.getLocalPosition(sprite.parent);
    sprite.x = pos.x - dragOffset.x;
    sprite.y = pos.y - dragOffset.y;
  };

  const onDragEnd = () => {
    if (dragged && spriteRefs.current[dragged]) {
      checkSnapToMarker(spriteRefs.current[dragged], dragged);
    }
    setDragged(null);
    draggingRef.current = false;
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current || !dragged || !spriteRefs.current[dragged]) return;

    const sprite = spriteRefs.current[dragged];
    const global = e.data.global;
    sprite.x = global.x;
    sprite.y = global.y;
  };

  const checkRightPlacing = (sprite, marker) => {
    if (marker.expecting === sprite.id) {
      sprite.tint = 0x16ff00;
      setTimeout(() => {
        sprite.tint = 0xffffff;
        setMarkerFilled(marker.id, true);
        setMarkerFilled(initialMarkerMap.current[sprite.id], true);
        setMarkerAlpha(marker.id, 0);
        setLockedSprites(prev => ({ ...prev, [sprite.id]: true }));
      }, 300);
    } else if (marker.expecting !== null) {
      sprite.tint = 0xff0000;
      setPoints(prev => prev *0.8);
      setMarkerFilled(marker.id, false);
      setTimeout(() => sprite.tint = 0xffffff, 300);
    }
  };

  const SNAP_THRESHOLD = 30;
  const checkSnapToMarker = (sprite, id) => {
    let snapped = false;

    for (const marker of markerPositions) {
      const dx = sprite.x - marker.x;
      const dy = sprite.y - marker.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < SNAP_THRESHOLD && !marker.filled) {
        snapped = true;

        sprite.eventMode = 'none';
        sprite.x = marker.x;
        sprite.y = marker.y;

        setTimeout(() => {
          setSpriteToMarkerMap(prev => ({ ...prev, [id]: marker.id }));
          checkRightPlacing(sprite, marker);
          sprite.eventMode = 'static';
        }, 100);
        break;
      }
    }

    if (!snapped) {
      const start = initialPositions.current[id];
      const originalMarkerId = initialMarkerMap.current[id];

      if (start && originalMarkerId) {
        sprite.eventMode = 'none';
        sprite.x = start.x;
        sprite.y = start.y;
        setTimeout(() => {
          sprite.eventMode = 'static';
        }, 50);

        setMarkerFilled(originalMarkerId, true);
        setSpriteToMarkerMap(prev => ({ ...prev, [id]: originalMarkerId }));
      }
    }
  };

  const selectCursor = id => {
    if (lockedSprites[id]) return 'not-allowed';
    if (hovered === id) return 'pointer';
    return 'default';
  };

  useEffect(() => {
    if (Object.keys(lockedSprites).length === renderElements.length) {
      Object.values(spriteRefs.current).forEach(sprite => {
        if (sprite) {
          sprite.tint = 0x16ff00;
        }
      });

      setTimeout(() => {
        Object.values(spriteRefs.current).forEach(sprite => {
          if (sprite) {
            sprite.tint = 0xffffff;
          }
        });
      }, 700);

      setTimeout(() => {
        setTotalPoints(prev => prev + points);
        setStage("game");
      }, 1300);
    }
  }, [lockedSprites]);

  const pageUP = () => {
    setPage(prev => prev +1);
  }

  const instructionPage =  () => {
    if(page === 1){
      return (
              <>
                <pixiSprite
                        anchor={0.5}
                        eventMode={'static'}
                        scale={0.6}
                        texture={textures.recipeopen}
                        x={273}
                        y={220}
                />
                <pixiText
                        text={(typedText + (showCursor ? '|' : '')).toUpperCase()}
                        x={75}
                        y={70}
                        style={{
                          fontFamily: 'micro5',
                          fontSize: 32,
                          wordWrap: true,
                          wordWrapWidth: 400,
                        }}
                        anchor={{ x: 0, y: 0 }}
                />

                {(showButton &&
                        <Button
                                x={370}
                                y={275}
                                color={0xdcc08e}
                                lineColor={0x5d3c1a}
                                width={90}
                                height={35}
                                label={"next"}
                                action={pageUP}
                        />)}
              </>
      )
    }
  }

  const background = () => (
          <>
            <pixiTilingSprite
                    texture={textures.tableBackground}
                    eventMode={'none'}
                    width={dimensions.width}
                    height={325}
                    tilePosition={{x:0, y:0}}
                    tileScale={0.2}
            />
            <pixiSprite
                    anchor={0.5}
                    eventMode={'none'}
                    scale={0.325}
                    texture={textures.placemat}
                    x={273}
                    y={210}
            />
          </>
  );

  const markers = () => markerPositions.map(marker => (
          <pixiGraphics
                  key={marker.id}
                  x={marker.x}
                  y={marker.y}
                  anchor={0.5}
                  draw={(g) => drawMarker(g, marker)}
                  eventMode={'none'}
          />
  ));

  const sprites = () => renderElements.map(object => (
          <pixiSprite
                  key={object.id}
                  ref={el => { if (el) { el.id = object.id; spriteRefs.current[object.id] = el; }}}
                  anchor={object.anchor}
                  eventMode={'static'}
                  scale={object.scale}
                  texture={object.texture}
                  x={object.x}
                  y={object.y}
                  onMouseOver={() => setHovered(object.id)}
                  onMouseOut={() => setHovered("")}
                  cursor={selectCursor(object.id)}
                  onPointerDown={(e) => onDragStart(e, object.id)}
                  onPointerUp={onDragEnd}
                  onPointerMove={onDragMove}
          />
  ));

  const minigame = () => {
    if(page === 2){
      return (
              <>
        {background()}
        <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.beginFill(0xffffff, 0);
                  g.drawRect(0, 0, dimensions.width, 325);
                  g.endFill();
                }}
                anchor={0.5}
                eventMode="static"
                onPointerMove={handlePointerMove}
        />
        {markers()}
        {sprites()}
      </>
      )
    }
  };

  return (
          <>
            {instructionPage()}
            {minigame()}
          </>
  );
};