import React, {useEffect, useMemo, useState} from "react";
import {useLoadTextures} from "../../hooks/useLoadTextures.tsx";
import {Sprite, Text} from "@pixi/react"
import {TextStyle} from "pixi.js";
import {Button} from "@/components/cookingGame/Button.tsx";
import {Stages} from "@/components/cookingGame/Stages.ts";
import recipeopen from '@/assets/cooking-sprites/recipeopen.png';
import {t} from "@lingui/core/macro";

interface RecipeStageProps {
  setStage: (stage: Stages) => void;
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>;
}

export const RecipeStage:React.FC<RecipeStageProps> =  ({ setStage, setTotalPoints }) => {
  const [text, setText] = useState('');
  const [page, setPage] = useState(1);
  const [label, setLabel] = useState("weiter");


  const texturePaths = useMemo(() => ({
    recipeopen: recipeopen
  }), []);

  const pageTexts = useMemo(() => [
    t`Welcome boss! \nToday we are cooking pasta!\n\nFortunately, our Smartkitchen can be equipped with the right settings do most of the work. We must follow the following steps: \n\n 1. Buying ingredients \n 2. Prepare and cook the dish \n 3. Serve the dish`
  ], []);

  const {textures, loaded} = useLoadTextures(texturePaths);

  //-----------------------text/typing-----------------------

  useEffect(() => {
    setText(pageTexts[page-1]);
  }, [page]);

  const action = () => {
    if (page < pageTexts.length) {
      if (page === pageTexts.length - 1) {
        setLabel("ende");
      }
      setPage(page + 1);
    } else {
      setTotalPoints((prev : number) => prev + 100);
      setTotalPoints((prev : number) => prev + 100);
      setStage(Stages.GAME);
    }
  };



  return (
          <>
            {loaded && textures.recipeopen && (<Sprite
                    scale={0.6}
                    texture={textures.recipeopen}
                    x={-33}
                    y={-90}
            />)}

            {loaded && textures.recipeopen &&(<Text
                    text={(text).toUpperCase()}
                    x={75}
                    y={70}
                    style={
                      new TextStyle({
                        fontFamily:'LoResRegular',
                        fontSize: 20,
                        wordWrap:true,
                        wordWrapWidth: 400,
                      })}
                    anchor={{x:0,y:0}}
            />)}
            {
                <Button
                        x={370}
                        y={275}
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