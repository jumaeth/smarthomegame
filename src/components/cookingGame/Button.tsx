import {Graphics} from "pixi.js";
import {extend} from "@pixi/react";
import {useCallback, useState} from "react";

extend({
  Graphics
});

export const Button =  ({x, y, width, height, label, action} ) => {

  const [hovered, setHovered] = useState(false);
  const color = hovered ? 0xeeeeee : 0x000000;

  const draw = useCallback((g) => {
    g.clear();
    g.fill(0xdcc08e);
    g.lineStyle(3, 0x5d3c1a, 1);
    g.roundRect(0, 0, width, height, 5);
    g.endFill();
  }, [hovered]);


  return (
          <>
            <pixiGraphics
                    x={x}
                    y={y}
                    draw={draw}
                    interactive
                    eventMode={'static'}
                    onPointerDown={action}
                    onMouseOver={() => setHovered(true)}
                    onMouseOut={() => setHovered(false)}
                    cursor={hovered ? 'pointer' : 'none'}
            />
            <pixiText
                    text={label.toUpperCase()}
                    x={x + width/2}
                    y={y + height/2}
                    style={{
                      fontFamily: 'micro5',
                      fontSize: 30,
                      wordWrap: true,
                      wordWrapWidth: width-10,
                      fill: {color}
                    }}
                    anchor={{ x: 0.5, y: 0.6 }}
            />
          </>
  )
};