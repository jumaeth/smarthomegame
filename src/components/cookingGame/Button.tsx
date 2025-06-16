import {Text, Graphics} from "pixi.js";
import {useCallback, useState} from "react";

export const Button =  ({x, y, width, height, label, action, color, lineColor} ) => {

  const [hovered, setHovered] = useState(false);
  const textColor = hovered ? 0xeeeeee : 0x000000;

  const draw = useCallback((g) => {
    g.clear();
    g.fill(color);
    g.lineStyle(3, lineColor, 1);
    g.roundRect(0, 0, width, height, 5);
    g.endFill();
  }, [hovered]);


  return (
          <>
            <Graphics
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
            <Text
                    text={label.toUpperCase()}
                    x={x + width/2}
                    y={y + height/2}
                    style={{
                      fontFamily: 'micro5',
                      fontSize: 30,
                      wordWrap: true,
                      wordWrapWidth: width-10,
                      fill: {color: textColor}
                    }}
                    anchor={{ x: 0.5, y: 0.6 }}
            />
          </>
  )
};