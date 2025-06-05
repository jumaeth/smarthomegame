import {Graphics} from "pixi.js";
import {extend} from "@pixi/react";
import {useCallback, useState} from "react";

extend({
  Graphics
});

export const Button =  ({x, y, width, height, label, action} ) => {

  const [hovered, setHovered] = useState(false);
  const color = hovered ? 0x8d5d23 :  0x6f4517;

  const draw = useCallback((g) => {
    g.clear();
    g.fill(0xdcc08e);
    g.lineStyle(3, color, 1);
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
                      color: {color},
                      fontSize: 30,
                      wordWrap: true,
                      wordWrapWidth: width-10,
                    }}
                    anchor={{ x: 0.5, y: 0.6 }}
            />
          </>
  )
};