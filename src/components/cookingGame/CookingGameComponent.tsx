import {Assets, Texture} from "pixi.js";
import React, {useEffect, useRef, useState} from "react";
import {GameStage} from "./GameStage.tsx";
import {RecipeStage} from "./RecipeStage.tsx";
import {IngredientsStage} from "./IngredientsStage.tsx";
import {CookingStage} from "./CookingStage.tsx";
import {ServeStage} from "./ServeStage.tsx";
import {Stage, TilingSprite} from "@pixi/react";
import {Stages} from "./Stages.ts"
import counterImg from '@/assets/cooking-sprites/counter.png';

interface CookingGameComponentProps {
  onCompletion: () => void;
}

export const CookingGameComponent: React.FC<CookingGameComponentProps> = ({ onCompletion }) => {

  const customFont= new FontFace("micro5","url(/fonts/micro5.ttf)");
  customFont.load().then(()=>document.fonts.add(customFont));
  const[nextStage,setNextStage]=useState(1);
  const[currentStage,setCurrentStage]=useState(Stages.GAME);
  const[texture,setTexture]=useState(Texture.EMPTY);
  const containerRef=useRef<HTMLDivElement>(null);
  const[dimensions,setDimensions]=useState({width:0,height:0});
  const[isTextureLoaded,setIsTextureLoaded]=useState(false);
  const[notificationProperties,setNotificationProperties]=useState({x:0,y:0,alpha:0});
  const initStateRef=useRef(true);
  const[totalPoints,setTotalPoints]=useState(0);
  const [passedStages, setPassedStages] = useState(0);


  const secureSetStage= (stage : Stages) =>{
    if(stage==Stages.GAME){
      setCurrentStage(stage);
      setPassedStages((prev: number) => prev+1);
    }else if(stage === nextStage){
      setNextStage(prev=>prev+1);
      setCurrentStage(stage);
    }
  };

  useEffect(()=>{
    if(texture===Texture.EMPTY){
      Assets.load(counterImg)
              .then((result)=>{
                setTexture(result);
                setIsTextureLoaded(true);
              });
    }
  },[texture]);

  useEffect(()=>{
    if(containerRef.current){
      setDimensions({
        width: 544,
        height: 325
      })
    }
  },[]);

  useEffect(()=>{
    if(dimensions.width!==0&&dimensions.height!==0){
      switch(currentStage){
        case Stages.GAME:
          if(initStateRef.current){
            setTimeout(()=>{
              setNotificationProperties({x: 130,y: 35,alpha:1});
              initStateRef.current=false;
            },10);
          }
          break;
        case Stages.RECIPE:
          setNotificationProperties({x:125,y:200,alpha:1});
          break;
        case Stages.INGREDIENTS:
          setNotificationProperties({x:520,y:55,alpha:1});
          break;
        case Stages.COOK:
          setNotificationProperties({x:520,y:200,alpha:1});
          break;
        case Stages.SERVE:
          setNotificationProperties({x:0,y:0,alpha:0});
          break;
      }
    }
  },[currentStage,dimensions,initStateRef]);

  const stageMap: { [key: number]: () => JSX.Element } = {
    [Stages.GAME]:() => <GameStage setStage={secureSetStage} notificationProperties={notificationProperties}/>,
    [Stages.RECIPE]:() => <RecipeStage setStage={secureSetStage} setTotalPoints={setTotalPoints}/>,
    [Stages.INGREDIENTS]:()=><IngredientsStage setStage={secureSetStage} setTotalPoints={setTotalPoints}/>,
    [Stages.COOK]:()=><CookingStage setStage={secureSetStage} setTotalPoints={setTotalPoints}/>,
    [Stages.SERVE]:()=><ServeStage setStage={secureSetStage} dimensions={dimensions} setTotalPoints={setTotalPoints}/>
};

  useEffect(()=>{
    if(passedStages === 4 && totalPoints/4>50){
      setTimeout(()=>onCompletion(),100);
    }
  },[totalPoints]);

  return (
     <div ref={containerRef} className="h-[90%]mt-5">
              {(isTextureLoaded&&
                      <Stage
                              width={dimensions.width}
                              height={dimensions.height}>
                        <TilingSprite
                                texture={texture}
                                width={dimensions.width}
                                height={dimensions.height}
                                tilePosition={{ x: 0, y: 0 }}
                                tileScale={{ x: 0.225, y: 0.225 }}
                        />
                        {stageMap[currentStage]()}

                      </Stage>
              )}
    </div>
  );
};