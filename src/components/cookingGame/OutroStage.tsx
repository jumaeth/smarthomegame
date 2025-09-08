import React, {useMemo} from "react";
import {useLoadTextures} from "../../hooks/useLoadTextures.tsx";
import {Graphics, Sprite, Text} from "@pixi/react"
import {Graphics as PixiGraphics, TextStyle} from "pixi.js";
import {Button} from "@/components/cookingGame/Button.tsx";
import {Stages} from "@/components/cookingGame/Stages.ts";
import {t} from "@lingui/core/macro";

interface OutroStageProps {
  setStage: (stage: Stages) => void;
}

export const OutroStage:React.FC<OutroStageProps> =  ({ setStage }) => {
  const label = t`End`;


  const texturePaths = useMemo(() => ({
    outro: "/src/assets/cooking-sprites/threeD_Plate.png"
  }), []);

  const text = t`That's it, you've done a great job. Enjoy your pasta! But don't rest too long, there are still plenty of smart devices waiting for you.`;

  const {textures, loaded} = useLoadTextures(texturePaths);

  //-----------------------text/typing-----------------------
  const action = () => {
    setStage(Stages.END);
  };

  const draw = React.useCallback((g: PixiGraphics) => {
    g.clear();
    g.beginFill(0xdcc08e, 1);
    g.lineStyle(3, 0x5d3c1a);
    g.drawRoundedRect(215, 140, 300, 120, 8);
    g.endFill();
  }, []);


  return (
          <>
            {loaded && textures.outro && (<Sprite
                    scale={0.65}
                    texture={textures.outro}
                    x={-30}
                    y={-20}
            />)}
            {loaded && (<Graphics
                    draw={draw}
                    anchor={{ x: 0, y: 0 }}
            />)}

            {loaded && (<Text
                    text={(text).toUpperCase()}
                    x={225}
                    y={150}
                    style={
                      new TextStyle({
                        fontFamily:'LoResRegular',
                        fontSize: 20,
                        wordWrap:true,
                        wordWrapWidth: 300,
                      })}
                    anchor={{x:0,y:0}}
            />)}
            {
                <Button
                        x={425}
                        y={270}
                        color={0xdcc08e}
                        lineColor={0x5d3c1a}
                        width={90}
                        height={30}
                        label={label}
                        action={action}
                    />}
          </>
  );
};