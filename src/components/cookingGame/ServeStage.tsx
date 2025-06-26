import {Sprite, Text, Graphics, TilingSprite} from '@pixi/react';
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useLoadTextures} from "../../hooks/useLoadTextures.tsx";
import {useTypingText} from "../../hooks/useTypingText.tsx";
import {Button} from "./Button.tsx";
import {EventMode, FederatedPointerEvent} from 'pixi.js';
import {TextStyle, Graphics as PIXIGraphics, Sprite as PIXISprite} from "pixi.js";
import {Stages} from "@/components/cookingGame/Stages.ts";
import recipeopenImg from "@/assets/cooking-sprites/recipeopen.png";
import tableBackgroundImg from "@/assets/cooking-sprites/table_background.png";
import placematImg from "@/assets/cooking-sprites/placemat.png";
import plateImg from "@/assets/cooking-sprites/plate_with_food.png";
import cutleryImg from "@/assets/cooking-sprites/cutlery.png";
import glasImg from "@/assets/cooking-sprites/glas.png";
import napkinImg from "@/assets/cooking-sprites/napkin.png";
import spoonImg from "@/assets/cooking-sprites/spoon.png";

interface ServeStageProps {
  setStage: (stage: Stages) => void;
  dimensions: {width: number, height: number}
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>;
}

type InteractiveSprite = PIXISprite & {
  eventMode: EventMode;
  id: string;
};

export const ServeStage:React.FC<ServeStageProps> = ({setStage, dimensions, setTotalPoints}) => {
  const [showButton, setShowButton] = useState(false);
  const [hovered, setHovered] = useState("");
  const [dragged, setDragged] = useState("");
  const [spriteToMarkerMap, setSpriteToMarkerMap] = useState<Record<string, string>>({});
  const [lockedSprites, setLockedSprites] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [points, setPoints] = useState(100);
  const [pointerdown, setPointerdown] = useState(false);

  const draggingRef = useRef(false);

  const instruction = "Wir sind fast fertig! \n\nAls letztes müssen wir den Tisch decken und unser Gericht servieren";

  const texturePaths = useMemo(() => ({
    recipeopen: recipeopenImg,
    tableBackground: tableBackgroundImg,
    placemat: placematImg,
    plate: plateImg,
    cutlery: cutleryImg,
    glas: glasImg,
    napkin: napkinImg,
    spoon: spoonImg,
  }), []);

  const  initialPositions = useRef<Record<string, { x: number; y: number }>>({
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
    spoon: "5"
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

  const drawMarker = (g : PIXIGraphics, marker : Marker) => {
    g.clear();
    g.beginFill( 0xeeeeee, marker.alpha);
    g.lineStyle(marker.alpha === 0 ? 0 : 1, 0x000000);
    g.drawRoundedRect(0, 0, 20, 20, 2);
    g.endFill();
  };

  const [spritePositions, setSpritePositions] = useState(() => ({
    plate: { x: initialPositions.current.plate.x, y: initialPositions.current.plate.y },
    cutlery: { x: initialPositions.current.cutlery.x, y: initialPositions.current.cutlery.y },
    glas: { x: initialPositions.current.glas.x, y: initialPositions.current.glas.y },
    napkin: { x: initialPositions.current.napkin.x, y: initialPositions.current.napkin.y },
    spoon: { x: initialPositions.current.spoon.x, y: initialPositions.current.spoon.y },
  }));

  const plate = { id: "plate", scale: 0.1,  texture: textures.plate, x: spritePositions.plate.x, y: spritePositions.plate.y, anchor: {x: 0.4, y: 0.4} };
  const cutlery = { id: "cutlery", scale: 0.08,  texture: textures.cutlery, x: spritePositions.cutlery.x, y: spritePositions.cutlery.y, anchor: {x: 0.4, y: 0.4} };
  const glas = { id: "glas", scale: 0.09, texture: textures.glas, x: spritePositions.glas.x, y: spritePositions.glas.y, anchor: {x: 0.4, y: 0.4} };
  const napkin = { id: "napkin", scale: 0.08,  texture: textures.napkin, x: spritePositions.napkin.x, y: spritePositions.napkin.y, anchor: {x: 0.5, y: 0.45} };
  const spoon = { id: "spoon", scale: 0.07,  texture: textures.spoon, x: spritePositions.spoon.x, y: spritePositions.spoon.y, anchor: {x: 0.45, y: 0.38} };


  const renderElements = [plate, cutlery, glas, napkin, spoon];
  const spriteRefs = useRef<Record<string, PIXISprite>>({});
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const onDragStart = (e: FederatedPointerEvent, id: string) => {
    if (lockedSprites[id]) return;
    setPointerdown(true);
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

  const onDragMove = (e: FederatedPointerEvent) => {

    if (pointerdown) {
      if (!dragged || !spriteRefs.current[dragged]) return;
      const sprite = spriteRefs.current[dragged];
      const pos = e.data.getLocalPosition(sprite.parent);
      sprite.x = pos.x - dragOffset.x;
      sprite.y = pos.y - dragOffset.y;

      setSpritePositions(prev => ({
        ...prev,
        [dragged]: { x: sprite.x, y: sprite.y }
      }));
    }
  };

  const onDragEnd = () => {
    if (dragged && spriteRefs.current[dragged]) {
      checkSnapToMarker(spriteRefs.current[dragged] as InteractiveSprite, dragged);
    }
    setDragged("");
    setPointerdown(false);
    draggingRef.current = false;
  };

  const handlePointerMove = (e: FederatedPointerEvent) => {
    if (pointerdown) {
      if (!draggingRef.current || !dragged || !spriteRefs.current[dragged]) return;

      const sprite = spriteRefs.current[dragged];
      const global = e.data.global;
      sprite.x = global.x;
      sprite.y = global.y;

      setSpritePositions(prev => ({
        ...prev,
        [dragged]: { x: sprite.x, y: sprite.y }
      }));
    }
  };

  const checkRightPlacing = (sprite: InteractiveSprite, marker: Marker) => {
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
  const checkSnapToMarker = (sprite: InteractiveSprite, id: string) => {
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

        setSpritePositions(prev => ({
          ...prev,
          [dragged]: { x: sprite.x, y: sprite.y }
        }));

        checkRightPlacing(sprite, marker);
        setSpriteToMarkerMap(prev => ({ ...prev, [id]: marker.id }));
        sprite.eventMode = 'static';
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

        setSpritePositions(prev => ({
          ...prev,
          [dragged]: { x: sprite.x, y: sprite.y }
        }));

        setTimeout(() => {
          sprite.eventMode = 'static';
        }, 50);

        setMarkerFilled(originalMarkerId, true);
        setSpriteToMarkerMap(prev => ({ ...prev, [id]: originalMarkerId }));
      }
    }
  };

  const selectCursor = (id: string) => {
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
        setStage(Stages.GAME);
      }, 1300);
    }
  }, [lockedSprites]);

  const pageUP = () => {
    setPage(prev => prev +1);
  };

  const instructionPage =  () => {
    if(page === 1 && textures.recipeopen){
      return (
              <>
                <Sprite
                        anchor={0.5}
                        eventMode={'static'}
                        scale={0.6}
                        texture={textures.recipeopen}
                        x={272}
                        y={220}
                />
                <Text
                        text={(typedText + (showCursor ? '|' : '')).toUpperCase()}
                        x={75}
                        y={70}
                        style={
                          new TextStyle({
                            fontFamily:'micro5',
                            fontSize:32,
                            wordWrap:true,
                            wordWrapWidth:400,
                          })}
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
                                label={"Weiter"}
                                action={pageUP}
                        />)}
              </>
      )
    }
  };

  const background = () => (
          <>
            <TilingSprite
                    texture={textures.tableBackground}
                    eventMode={'none'}
                    width={544}
                    height={325}
                    tilePosition={{x:0, y:0}}
                    tileScale={0.2}
            />
            <Sprite
                    anchor={0.5}
                    eventMode={'none'}
                    scale={0.325}
                    texture={textures.placemat}
                    x={272}
                    y={210}
            />
          </>
  );

  const markers = () => markerPositions.map(marker => (
          <Graphics
                  key={marker.id}
                  x={marker.x}
                  y={marker.y}
                  anchor={0.5}
                  draw={(g) => drawMarker(g, marker)}
                  eventMode={'none'}
          />
  ));

  const sprites = () => renderElements.map(object => (
          <Sprite
                  key={object.id}
                  ref={(el: InteractiveSprite) => {   if (el) {
                    (el as InteractiveSprite).id = object.id;
                    spriteRefs.current[object.id] = el as InteractiveSprite;
                  }}}
                  anchor={object.anchor}
                  eventMode={'static'}
                  scale={object.scale}
                  texture={object.texture}
                  x={object.x}
                  y={object.y}
                  pointerover={() => setHovered(object.id)}
                  pointerout={() => setHovered("")}
                  cursor={selectCursor(object.id)}
                  pointerdown={(e) => onDragStart(e, object.id)}
                  pointerup={onDragEnd}
                  pointermove={onDragMove}
          />
  ));

  const minigame = () => {
    if(page === 2){
      return (
              <>
        {background()}
        <Graphics
                draw={(g) => {
                  g.clear();
                  g.beginFill(0xffffff, 0);
                  g.drawRect(0, 0, dimensions.width, 325);
                  g.endFill();
                }}
                eventMode="static"
                pointermove={handlePointerMove}
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