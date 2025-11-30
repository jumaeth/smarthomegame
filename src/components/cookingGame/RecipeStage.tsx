import React, { useEffect, useMemo, useState } from "react";
import { useLoadTextures } from "../../hooks/useLoadTextures.tsx";
import { Sprite, Text } from "@pixi/react"
import { TextStyle } from "pixi.js";
import { Button } from "@/components/cookingGame/Button.tsx";
import { Stages } from "@/components/cookingGame/Stages.ts";
import { t } from "@lingui/core/macro";
import recipeOpenImg from "@/assets/cooking-sprites/recipeopen.png";

interface RecipeStageProps {
  setStage: (stage: Stages) => void;
}

export const RecipeStage: React.FC<RecipeStageProps> = ({ setStage }) => {
  const [text, setText] = useState('');
  const [page, setPage] = useState(1);
  const [label, setLabel] = useState(t`continue`);


  const texturePaths = useMemo(() => ({
    recipeOpen: recipeOpenImg
  }), []);

  const pageTexts = useMemo(() => [
    t`Welcome chef! \nToday we're making pasta!\n\nFortunately, our Smart Kitchen can be set up with the right settings to do most of the work. We just need to follow these steps: \n\n 1. Buy the ingredients \n 2. Prepare and cook the dish \n 3. Serve the dish`
  ], []);

  const { textures, loaded } = useLoadTextures(texturePaths);

  //-----------------------text/typing-----------------------

  useEffect(() => {
    setText(pageTexts[page - 1]);
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



  return (
    <>
      {loaded && textures.recipeOpen && (<Sprite
        scale={0.6}
        texture={textures.recipeOpen}
        x={-33}
        y={-90}
      />)}

      {loaded && textures.recipeOpen && (<Text
        text={(text).toUpperCase()}
        x={75}
        y={70}
        style={
          new TextStyle({
            fontFamily: 'LoResRegular',
            fontSize: 20,
            wordWrap: true,
            wordWrapWidth: 400,
          })}
        anchor={{ x: 0, y: 0 }}
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