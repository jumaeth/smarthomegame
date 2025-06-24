import {Assets, Texture} from "pixi.js";
import React, { useEffect, useRef, useState} from "react";
import {GameStage} from "./GameStage.tsx";
import {RecipeStage} from "./RecipeStage.tsx";
import {IngredientsStage} from "./IngredientsStage.tsx";
import {CookingStage} from "./CookingStage.tsx";
import {ServeStage} from "./ServeStage.tsx";
import {Stage, TilingSprite} from "@pixi/react";
import {CookingGameComponent as pos, Global} from "./cookingGameEnums.ts"

interface CookingGameComponentProps {
  onCompletion: () => void;
}

export const CookingGameComponent: React.FC<CookingGameComponentProps> = ({ onCompletion }) => {

  const customFont= new FontFace("micro5","url(/fonts/micro5.ttf)");
  customFont.load().then(()=>document.fonts.add(customFont));
  const[nextStage,setNextStage]=useState(1);
  const[currentStage,setCurrentStage]=useState("game");
  const[texture,setTexture]=useState(Texture.EMPTY);
  const containerRef=useRef<HTMLDivElement>(null);
  const[dimensions,setDimensions]=useState({width:0,height:0});
  const[isTextureLoaded,setIsTextureLoaded]=useState(false);
  const[notificationProperties,setNotificationProperties]=useState({x:0,y:0,alpha:0});
  const initStateRef=useRef(true);
  const[totalPoints,setTotalPoints]=useState(0);
  const [passedStages, setPassedStages] = useState(0);

  const stages=[
    "game","recipe","ingredients","cook","serve"
  ];

  const secureSetStage= (stage : string) =>{
    if(stage=="game"){
      setCurrentStage(stage);
      setPassedStages((prev: number) => prev+1);
    }else if(stages.indexOf(stage)===nextStage){
      setNextStage(prev=>prev+1);
      setCurrentStage(stage);
    }
  };

  useEffect(()=>{
    if(texture===Texture.EMPTY){
      Assets.load("/src/assets/cooking-sprites/counter.png")
              .then((result)=>{
                setTexture(result);
                setIsTextureLoaded(true);
              });
    }
  },[texture]);

  useEffect(()=>{
    if(containerRef.current){
      setDimensions({
        width: Global.ApplicationWidth,
        height: Global.ApplicationHeight
      })
    }
  },[]);

  useEffect(()=>{
    if(dimensions.width!==0&&dimensions.height!==0){
      switch(currentStage){
        case"game":
          if(initStateRef.current){
            setTimeout(()=>{
              setNotificationProperties({x: pos.NotificationXRec,y: Global.StandardButtonHeight,alpha:1});
              initStateRef.current=false;
            },10);
          }
          break;
        case"recipe":
          setNotificationProperties({x:pos.NotificationXIngr,y:pos.LowerRowY,alpha:1});
          break;
        case"ingredients":
          setNotificationProperties({x:pos.RightRowX,y:pos.NotificationYCook,alpha:1});
          break;
        case"cook":
          setNotificationProperties({x:pos.RightRowX,y:pos.LowerRowY,alpha:1});
          break;
        case"serve":
          setNotificationProperties({x:0,y:0,alpha:0});
          break;
      }
    }
  },[currentStage,dimensions,initStateRef]);

  const stageMap: { [key: string]: () => JSX.Element } = {
    game:() => <GameStage setStage={secureSetStage} notificationProperties={notificationProperties}/>,
    recipe:() => <RecipeStage setStage={secureSetStage} setTotalPoints={setTotalPoints}/>,
    ingredients:()=><IngredientsStage setStage={secureSetStage} setTotalPoints={setTotalPoints}/>,
    cook:()=><CookingStage setStage={secureSetStage} setTotalPoints={setTotalPoints}/>,
    serve:()=><ServeStage setStage={secureSetStage} dimensions={dimensions} setTotalPoints={setTotalPoints}/>
};

  useEffect(()=>{
    if(passedStages === 4 && totalPoints/stages.length>50){
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
                                image={"/src/assets/cooking-sprites/counter.png"}
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
