import React, {useEffect, useMemo, useState} from "react";
import {useLoadTextures} from "../../hooks/useLoadTextures.tsx";
import {useTypingText} from "../../hooks/useTypingText.tsx";
import {Sprite, Text} from "@pixi/react"
import {TextStyle} from "pixi.js";
import {Button} from "@/components/cookingGame/Button.tsx";
import {RecipeStage as pos, Global} from "@/components/cookingGame/cookingGameEnums.ts";

interface RecipeStageProps {
  setStage: (stage: string) => void;
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>;
}

export const RecipeStage:React.FC<RecipeStageProps> =  ({ setStage, setTotalPoints }) => {
  const [text, setText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [page, setPage] = useState(1);
  const [label, setLabel] = useState("weiter");


  const texturePaths = useMemo(() => ({
    recipeopen: "/src/assets/cooking-sprites/recipeopen.png"
  }), []);

  const pageTexts = useMemo(() => [
    "Wilkommen Chef! \nHeute kochen wir Pasta!\n\nZum Glück kann unsere Smartkitchen mit den richtigen " +
    "Einstellungen die meiste Arbeit übernehmen.",
    "Wir müssen folgende Schritte befolgen: \n\n 1. Zutaten einkaufen \n 2. Gericht vorbereiten und kochen \n 3. Gericht servieren"
  ], []);

  const {textures, loaded} = useLoadTextures(texturePaths);

  //-----------------------text/typing-----------------------
  const { typedText, typingDone, showCursor } = useTypingText(text, Global.TextSpeed);

   useEffect(() => {
    if (typingDone) {
      const delay = setTimeout(() => {
        setShowButton(true);
      }, 500);

      return () => clearTimeout(delay);
    } else {
      setShowButton(false);
    }
  }, [typingDone]);


  useEffect(() => {
    setText(pageTexts[page-1]);
  }, [page]);

  const action = () => {
    if (page < pageTexts.length) {
      if (page === pageTexts.length - 1) {
        setLabel("end");
      }
      setPage(page + 1);
    } else {
      setTotalPoints((prev : number) => prev + 100);
      setTotalPoints((prev : number) => prev + 100);
      setStage("game");
    }
  };



  return (
          <>
            {loaded && textures.recipeopen && (<Sprite
                    scale={0.6}
                    texture={textures.recipeopen}
                    x={pos.BackgroundX}
                    y={pos.BackgroundY}
            />)}

            {loaded && textures.recipeopen &&(<Text
                    text={(typedText+(showCursor?'|':'')).toUpperCase()}
                    x={pos.TextX}
                    y={pos.TextY}
                    style={
                      new TextStyle({
                        fontFamily:'micro5',
                        fontSize: 30,
                        wordWrap:true,
                        wordWrapWidth: 400,
                      })}
                    anchor={{x:0,y:0}}
            />)}
            {(showButton&&
                <Button
                        x={pos.ButtonX}
                        y={pos.ButtonY}
                        color={0xdcc08e}
                        lineColor={0x5d3c1a}
                        width={90}
                        height={30}
                        label={label}
                        action={action}
                    />)}
          </>
  );
};