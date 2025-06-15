import {Assets, Texture, TilingSprite} from "pixi.js";
import {useEffect, useRef, useState} from "react";
import {GameStage} from "./GameStage.tsx";
import {RecipeStage} from "./RecipeStage.tsx";
import {IngredientsStage} from "./IngredientsStage.tsx";
import {CookingStage} from "./CookingStage.tsx";
import {ServeStage} from "./ServeStage.tsx";
import {Stage} from "@pixi/react";

export const CookingGameComponent = ({setCompleted, reload}) => {

  const customFont = new FontFace("micro5", "url(/fonts/micro5.ttf)");
  customFont.load().then(() => document.fonts.add(customFont));
  const [nextStage, setNextStage] = useState(1);
  const [currentStage, setCurrentStage] = useState("game");
  const [texture, setTexture] = useState(Texture.EMPTY);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);
  const [notificationProperties, setNotificationProperties] = useState({x:0, y: 0, alpha: 0});
  const initStateRef = useRef(true);
  const [totalPoints, setTotalPoints] = useState(0);

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
    if (reload){
      setCurrentStage("game");
      setNextStage(1);
      initStateRef.current = true;
    }
  }, [reload]);

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
          if (initStateRef.current){
            setTimeout(()=>{
              setNotificationProperties({x: 130, y: 35, alpha: 1});
              initStateRef.current = false;
            },10);
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
  }, [currentStage, dimensions, initStateRef]);

  const stageMap = {
    game: () => <GameStage setStage={secureSetStage}  dimensions={dimensions} notificationProperties={notificationProperties} />,
    recipe: () => <RecipeStage setStage={secureSetStage} dimensions={dimensions} setTotalPoints={setTotalPoints}/>,
    ingredients: () => <IngredientsStage setStage={secureSetStage} setTotalPoints={setTotalPoints} />,
    cook: () => <CookingStage setStage={secureSetStage}  dimensions={dimensions} setTotalPoints={setTotalPoints}/>,
    serve: () => <ServeStage setStage={secureSetStage}  dimensions={dimensions} setTotalPoints={setTotalPoints}/>
  };

  useEffect(() => {
    if (totalPoints / stages.length > 50){
      setCompleted(true);
    }else{
      setCompleted(false);
    }
  }, [totalPoints]);


  return (
          <div ref={containerRef} className="h-[90%] mt-5">
              {(isTextureLoaded &&
                      <Stage
                              width={dimensions.width}
                              height={325}
                              backgroundColor={0xd87f20}>
                        {(
                                <TilingSprite
                                  texture={texture}
                                  eventMode={'none'}
                                  width={dimensions.width}
                                  height={325}
                                  tilePosition={{x:0, y:0}}
                                  tileScale={0.3}
                                />)}
                        {stageMap[currentStage]()}
                      </Stage>
              )}
          </div>
  );
};
