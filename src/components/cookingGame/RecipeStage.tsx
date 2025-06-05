import {Sprite, Text} from 'pixi.js'
import {extend} from "@pixi/react";
import {useEffect, useState} from "react";
import {Button} from "./Button.tsx";
import {useLoadTextures} from "../../hooks/useLoadTextures.tsx";
import {useTypingText} from "../../hooks/useTypingText.tsx";

extend({
  Sprite,
  Text
});

export const RecipeStage = ({setStage, dimensions}) => {

  const [text, setText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [page, setPage] = useState(1);
  const [label, setLabel] = useState("next");


  const texturePaths: { [key: string]: string } = {
    recipeopen: "/cooking-sprites/recipeopen.png"
  };

  const pageTexts = [
          "Welcome Chef! \nToday we are cooking some pasta.\n\nLuckily, with the right configuration" +
          " our smart kitchen will do the heavy work for us",
          "We need to do the following steps: \n\n 1. Buy the ingredients \n 2. Prepare and cook the meal \n 3. Serve the meal"
  ];


  const {textures, loaded, errors} = useLoadTextures(texturePaths);

  //-----------------------text/typing-----------------------

  const { typedText, typingDone, showCursor } = useTypingText(text, 35);

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
    if(page < pageTexts.length){
      if(page === pageTexts.length-1){
        setLabel("end");
      }
      return setPage(page+1);
    }else{
      return setStage("game");
    }
  };


  return (
          <>
            <pixiSprite
                    anchor={0.5}
                    eventMode={'static'}
                    scale={0.6}
                    texture={textures.recipeopen}
                    x={dimensions.width*0.5}
                    y={dimensions.height*0.68}
            />
            <pixiText
                    text={(typedText + (showCursor ? '|' : '')).toUpperCase()}
                    x={dimensions.width*0.15}
                    y={dimensions.height*0.2}
                    style={{
                      fontFamily: 'micro5',
                      fontSize: 30,
                      wordWrap: true,
                      wordWrapWidth: 400,
                    }}
                    anchor={{ x: 0, y: 0 }}
            />
            {(showButton &&
              <Button
                    x={dimensions.width*0.7}
                    y={dimensions.height*0.85}
                    width={90}
                    height={35}
                    label={label}
                    action={action}
              />)}
          </>
  );
};