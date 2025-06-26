import {TextStyle} from "pixi.js";
import {useCallback, useState} from "react";
import {Graphics as PIXIGraphics} from "pixi.js"
import {Text, Graphics as REACTGraphics} from "@pixi/react";

interface ButtonProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  action: () => void;
  color: number;
  lineColor: number;
}

export const Button = ({ x, y, width, height, label, action, color, lineColor }: ButtonProps) => {

  const [hovered, setHovered] = useState(false);
  const textColor = hovered ? 0xeeeeee : 0x000000;

  const draw = useCallback((g : PIXIGraphics) => {
    g.clear();
    g.beginFill(color);
    g.lineStyle(3,lineColor, 1);
    g.drawRoundedRect(0,0,width,height, 5);
    g.endFill();
  }, [hovered]);

  return (
          <>
            <REACTGraphics
                    x={x}
                    y={y}
                    interactive={true}
                    draw={draw}
                    pointerdown={action}
                    pointerover={() => setHovered(true)}
                    pointerout={() => setHovered(false)}
                    cursor={hovered ? 'pointer' : 'default'}
            />
            <Text
                    text={label.toUpperCase()}
                    x={x + width/2}
                    y={y + height/2}
                    style={
                      new TextStyle({
                        fontFamily:'micro5',
                        fontSize:30,
                        wordWrap:true,
                        wordWrapWidth:width-10,
                        fill: textColor
                      })
                    }
                    anchor={{ x: 0.5, y: 0.6 }}
            />
          </>
  )
};