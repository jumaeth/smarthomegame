import {RenderElement} from "../objects/RenderElement";
import {Assets, Filter, Texture} from 'pixi.js';
import {useEffect, useRef, useState} from 'react';
import {ClickableElement} from "../objects/ClickableElement.ts";
import {Sprite} from "@pixi/react";

interface SpriteRender {
  content: RenderElement;
}

export const SpriteRender = (props: SpriteRender) => {
  const spriteRef = useRef(null);
  const [texture, setTexture] = useState(Texture.EMPTY);
  const [filter, setFilter] = useState<Filter[] | null>(null);

  const isInteractive = props.content instanceof ClickableElement;

  const handleMouseOver = () => {
    if (props.content instanceof ClickableElement){
      setFilter([props.content.mouseOver]);
    }
  };

  const handlePointerDown = () => {
    if (props.content instanceof ClickableElement && typeof props.content.onclick === 'function') {
      props.content.onclick();
    }
  };

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load(props.content.imagePath)
              .then((result) => {
                setTexture(result);
              })
    }
  }, [texture]);

  return <>
      <Sprite
              ref={spriteRef}
              anchor={0.5}
              eventMode={'static'}
              scale={props.content.scale}
              texture={texture}
              x={props.content.xCoordinate}
              y={props.content.yCoordinate}
              filters={filter}
              onmouseover={handleMouseOver}
              onmouseout={()=>setFilter(null)}
              onpointerdown={()=>handlePointerDown()}
              cursor={isInteractive?'pointer':'none'}
        />
  </>
};