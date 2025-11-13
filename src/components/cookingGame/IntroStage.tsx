import React, {useEffect, useMemo, useState} from "react";
import {useLoadTextures} from "../../hooks/useLoadTextures.tsx";
import {Graphics, Sprite, Text} from "@pixi/react"
import {Graphics as PixiGraphics, TextStyle} from "pixi.js";
import boxImg from "@/assets/cooking-sprites/empty_box.png"
import {Button} from "@/components/cookingGame/Button.tsx";
import {Stages} from "@/components/cookingGame/Stages.ts";
import {t} from "@lingui/core/macro";

interface IntroStageProps {
  setStage: (stage: Stages) => void;
}

export const IntroStage:React.FC<IntroStageProps> =  ({ setStage }) => {
  const [text, setText] = useState('');
  const [page, setPage] = useState(1);
  const [label, setLabel] = useState(t`continue`);


  const texturePaths = useMemo(() => ({
    box: boxImg
  }), []);

  const pageTexts = useMemo(() => [
    t`Hm, still no pizza in sight...\nBut isn't it hard to work if you're hungry? Let's make a simple dish before we continue to save our smart home`
  ], []);

  const {textures, loaded} = useLoadTextures(texturePaths);

  //-----------------------text/typing-----------------------

  useEffect(() => {
    setText(pageTexts[page-1]);
  }, [page]);

  const action = () => {
    if (page < pageTexts.length) {
      if (page === pageTexts.length - 1) {
        setLabel(t`end`);
      }
      setPage(page + 1);
    } else {
      setStage(Stages.GAME);
    }
  };

  const draw = React.useCallback((g: PixiGraphics) => {
    g.clear();
    g.beginFill(0xdcc08e, 1);
    g.lineStyle(3, 0x5d3c1a);
    g.drawRoundedRect(240, 60, 290, 150, 8);
    g.endFill();
  }, []);

  return (
          <>
            {loaded && textures.box && (<Sprite
                    scale={0.3}
                    texture={textures.box}
                    x={-20}
                    y={20}
            />)}
            {loaded && (<Graphics
                    draw={draw}
                    anchor={{ x: 0, y: 0 }}
            />)}

            {loaded && (<Text
                    text={(text).toUpperCase()}
                    x={250}
                    y={70}
                    style={
                      new TextStyle({
                        fontFamily:'LoResRegular',
                        fontSize: 20,
                        wordWrap:true,
                        wordWrapWidth: 275,
                      })}
                    anchor={{x:0,y:0}}
            />)}
            {
                <Button
                        x={440}
                        y={220}
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