import {RenderElement} from "../objects/RenderElement";
import {extend,} from '@pixi/react';
import {Assets, Container, Graphics, Sprite, Texture,} from 'pixi.js';
import {useEffect, useRef, useState} from 'react';
import {ClickableElement} from "../objects/ClickableElement.ts";

interface SpriteRender {
  content: RenderElement;
}

export const SpriteRender = (props: SpriteRender) => {
  const spriteRef = useRef(null);
  const [texture, setTexture] = useState(Texture.EMPTY);
  const [filter, setFilter] = useState<PIXI.Filter | undefined>(undefined);

  const isInteractive = props.content instanceof ClickableElement;

  const handleMouseOver = () => {
    if (props.content instanceof ClickableElement){
      setFilter(props.content.mouseOver);
    }
  };

  const handlePointerDown = () => {
    console.log("handlePointerDown");
    if (props.content instanceof ClickableElement && typeof props.content.onclick === 'function') {
      console.log("Doing onclick");
      props.content.onclick();
    }
  };


  extend({
    Container,
    Graphics,
    Sprite
  });




  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets
              .load(props.content.imagePath)
              .then((result) => {
                setTexture(result)
              });
    }
  }, [texture]);
  return <>
    <pixiSprite
            ref={spriteRef}
            anchor={0.5}
            eventMode={'static'}
            scale={props.content.scale}
            texture={texture}
            x={props.content.xCoordinate}
            y={props.content.yCoordinate}
            filters={filter}
            onMouseOver={handleMouseOver}
            onMouseOut={()=>setFilter(undefined)}
            onPointerDown={() => handlePointerDown()}
            cursor={isInteractive ? 'pointer' : 'none'}
    />

  </>;
};