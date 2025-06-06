import {Application, extend} from '@pixi/react';
import {Assets, Texture, TilingSprite} from "pixi.js";
import {useEffect, useRef, useState} from "react";
import {GameStage} from "./GameStage.tsx";
import {RecipeStage} from "./RecipeStage.tsx";
import {IngredientsStage} from "./IngredientsStage.tsx";
import {CookingStage} from "./CookingStage.tsx";

extend({
  TilingSprite
});

export const CookingGameComponent = () => {

  const customFont = new FontFace("micro5", "url(/fonts/micro5.ttf)");
  customFont.load().then(() => document.fonts.add(customFont));
  const [nextStage, setNextStage] = useState(3);
  const [currentStage, setCurrentStage] = useState("game");
  const [texture, setTexture] = useState(Texture.EMPTY);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);
  const [notificationProperties, setNotificationProperties] = useState({x:0, y: 0, alpha: 0});
  const [initState, setInitState] = useState(true);

  const stages = [
    "game", "recipe", "ingredients", "cook", "serve"
  ];

  const secureSetStage = stage => {
    if(stage == "game"){
      setCurrentStage(stage);
    } else if(stages.indexOf(stage) === nextStage){
      setNextStage(prev => prev+1);
      setCurrentStage(stage);
    }
  };

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load("/cooking-sprites/counter.png")
              .then((result) => {
                setTexture(result);
                setIsTextureLoaded(true);
              });
    }
  }, [texture]);


  useEffect(() => {
    if(containerRef.current){
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      })
    }
  }, []);

  useEffect(() => {
    if(dimensions.width !== 0 && dimensions.height !== 0){
      switch (currentStage){
        case "game":
          if (initState){
            setNotificationProperties({x: 130, y: 35, alpha: 1});
            setInitState(false);
          }
          break;
        case "recipe":
          setNotificationProperties({x: 125, y: 200, alpha: 1});
          break;
        case "ingredients":
          setNotificationProperties({x: 515, y: 55, alpha: 1});
          break;
        case "cook":
          setNotificationProperties({x: 520, y: 200, alpha: 1});
          break;
        case "serve":
          setNotificationProperties({x: 0, y: 0, alpha: 0});
          break;
      }
    }
  }, [currentStage, dimensions]);

  const stageMap = {
    game: () => <GameStage setStage={secureSetStage}  dimensions={dimensions} notificationProperties={notificationProperties} />,
    recipe: () => <RecipeStage setStage={secureSetStage} dimensions={dimensions} />,
    ingredients: () => <IngredientsStage setStage={secureSetStage} dimensions={dimensions} />,
    cook: () => <CookingStage setStage={secureSetStage}  dimensions={dimensions}/>,
    serve: () => <GameStage setStage={secureSetStage}  dimensions={dimensions} notificationProperties={notificationProperties} />
  };

  return (
          <div ref={containerRef} className="h-[90%] mt-5">
              {(isTextureLoaded &&
                      <Application
                              width={dimensions.width}
                              height={325}
                              backgroundColor={0xd87f20}>
                        {(
                                <pixiTilingSprite
                                  texture={texture}
                                  eventMode={'none'}
                                  width={dimensions.width}
                                  height={325}
                                  tilePosition={{x:0, y:0}}
                                  tileScale={0.3}
                                />)}
                        {stageMap[currentStage]()}
                      </Application>
              )}
          </div>
  );
};
