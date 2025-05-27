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
  const [filter, setFilter] = useState<PIXI.Filter[] | undefined>(undefined);
  const highlightAction = (content: RenderElement): PIXI.Filter | null => {
    if (content instanceof ClickableElement) {
      return content.mouseOver;
    }
    return null;
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
            onMouseOver={() => {
              const result = highlightAction(props.content);
              setFilter(result ? [result] : undefined);
            }}
            onMouseOut={()=>setFilter(undefined)}
    />

  </>;
};