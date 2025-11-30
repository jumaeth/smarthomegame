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
import {OutroStage} from "@/components/cookingGame/OutroStage.tsx";
import {IntroStage} from "@/components/cookingGame/IntroStage.tsx";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {SmartDevice} from "@/objects/SmartDevice.ts";
import {t} from "@lingui/core/macro";
import {DeviceNames} from "@/objects/DeviceNames.ts";

interface CookingGameComponentProps {
  onCompletion: () => void;
}

export const enum Score {Privacy, Comfort}

export const CookingGameComponent: React.FC<CookingGameComponentProps> = ({ onCompletion }) => {

  const customFont= new FontFace("LoResRegular","url(/fonts/LoRes12OT-Regular.ttf)");
  customFont.load().then(()=>document.fonts.add(customFont));
  const[nextStage,setNextStage]=useState(1);
  const[currentStage,setCurrentStage]=useState(Stages.GAME);
  const[texture,setTexture]=useState(Texture.EMPTY);
  const containerRef=useRef<HTMLDivElement | null>(null);
  const[dimensions,setDimensions]=useState({width:0,height:0});
  const[isTextureLoaded,setIsTextureLoaded]=useState(false);
  const[notificationProperties,setNotificationProperties]=useState({x:0,y:0,alpha:0});
  const initStateRef=useRef(true);
  const totalPoints=useRef<Map<Score, number>>(new Map<Score, number>);
  const gameService = useGameService();
  const device:SmartDevice = gameService.getDeviceByName(DeviceNames.SMART_KITCHEN);


  const secureSetStage= (stage : Stages) =>{
    if(stage==Stages.GAME) {
      setCurrentStage(stage);
    }else if(stage === Stages.END){
      const points = totalPoints.current;
      if(totalPoints.current){
        const privacy = points.get(Score.Privacy);
        const comfort = points.get(Score.Comfort);
        if (privacy)gameService.changeScore(privacy, "privacy");
        if (comfort)gameService.changeScore(comfort, "comfort");
      }
      const statsScore:number = points.get(Score.Privacy) ?? 0;
      device.getStatBlock().setValue(t`Smart Kitchen Points`,statsScore);
      onCompletion();
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
              setNotificationProperties({x: 380,y: 55,alpha:1});
              initStateRef.current=false;
            },10);
          }
          break;
        case Stages.INTRO:
          setNotificationProperties({x: 130,y: 35,alpha:1});
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
        case Stages.OUTRO:
          setNotificationProperties({x:0,y:0,alpha:0});
          break;
      }
    }
  },[currentStage,dimensions,initStateRef]);

  const stageMap: { [key: number]: () => JSX.Element } = {
    [Stages.GAME]:() => <GameStage setStage={secureSetStage} notificationProperties={notificationProperties}/>,
    [Stages.INTRO]:() => <IntroStage setStage={secureSetStage}/>,
    [Stages.RECIPE]:() => <RecipeStage setStage={secureSetStage}/>,
    [Stages.INGREDIENTS]:()=><IngredientsStage setStage={secureSetStage} setTotalPoints={totalPoints}/>,
    [Stages.COOK]:()=><CookingStage setStage={secureSetStage} setTotalPoints={totalPoints}/>,
    [Stages.SERVE]:()=><ServeStage setStage={secureSetStage} dimensions={dimensions} setTotalPoints={totalPoints}/>,
    [Stages.OUTRO]:()=><OutroStage setStage={secureSetStage}/>
};


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