import React, {useEffect, useMemo, useState} from "react";
import {useLoadTextures} from "../../hooks/useLoadTextures.tsx";
import {Button} from "./Button.tsx";
import {useTypingText} from "../../hooks/useTypingText.tsx";
import {TextStyle} from "pixi.js";
import {Text, Sprite} from "@pixi/react";

interface IngredientsStageProps {
  setStage: (stage: string) => void;
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>;
}

export const IngredientsStage: React.FC<IngredientsStageProps> = ({ setStage, setTotalPoints }) => {


  const texturePaths= useMemo(() => ({
    recipeopen: "/cooking-sprites/recipeopen.png",
    market: "/cooking-sprites/marketstand.png",
    marketBackground: "/cooking-sprites/market_background.png",
  }), []);

  const explanations = [
    "Lass uns zuerst die benötigten Zutaten kaufen. Für gute Pasta brauchen wir: \n\n\t1. Spaghetti\n\t2. Tomaten\n\t3. Gewürze\n\t4. Käse",
    "Du musst verschiedene Kriterien wie Kosten, Zeit und Qualität beachten. \n\nSei vorsichtig damit, deine Daten für " +
    "bessere Resultate preiszugeben."
  ];

  const btnTexts = [
    ["Lokaler Supermarkt, bar", "Gemüse Lieferdienst", "Italien Fachhändler", "Discounter, mit Karte"],
    ["Laden am Bauernhof", "Vegetarische box", "Co-op Bauernmarkt", "Markt"],
    ["Eigener Balkon", "Gehyptes Gewürz Startup", "Omas Garten ", "Nachhaltiger Laden"],
    ["Trip nach Italien", 'Workshop auf Bauernhof', "Im supermarkt (nochmal)", 'Von "parmesan.com"']
  ];

  const instructions = [
    "Spaghetti kaufen", "Tomaten kaufen", "Gewürze kaufen", "Käse kaufen"
  ];

  const finalMessage = [
    "Danke für deine Hilfe, mal sehen:\n\n- Die Zutaten haben eine",
    "Qualität.\n- Der Einkauf war", "\n- Dein Portmonee war ", "deinen Entscheidungen."
  ];

  const evalChoices = [
    ["Super", "normale", "schlechte"],
    ["schnell.", "langsam."],
    ["glücklich über", "nicht böse mit", "nicht einverstanden mit"]
  ];

  const conclusion = [
    "Super job", "Weiter", "Nochmals"
  ];

  function shuffledRange(n: number): number[] {
    return  Array.from({ length: n }, (_, i) => i + 1)
            .sort(() => Math.random() - 0.5).map(i => i-1);
  }

  const qualityPoints = [
    [75,65, 100, 50], //Spaghetti
    [100,75, 50, 25], //Tomato
    [60,75, 75, 85], //Spices
    [100,85, 75, 75] // Cheese
  ];

  const pricePoints = [
    [75,65, 25, 85], //Spaghetti
    [75,50, 75, 65], //Tomato
    [100,50, 100, 50], //Spices
    [75,85, 75, 75] // Cheese
  ];

  const timePoints = [
    [50,75, 25, 100], //Spaghetti
    [50,100, 75, 75], //Tomato
    [100,75, 25, 65], //Spices
    [0,50, 65, 75] // Cheese
  ];

  const privacyPoints = [
    [0.2,0.05, 0.15, 0.15], //Spaghetti
    [0.25,0.1, 0.2, 0.25], //Tomato
    [0.25, 0.1, 0.25, 0.2], //Spices
    [0.25,0.15, 0.2, 0.1] // Cheese
  ];

  const {textures, loaded} = useLoadTextures(texturePaths);
  const [buttonTexts, setButtonTexts] = useState(btnTexts[1]);
  const [text, setText] = useState(explanations[0]);
  const [page, setPage] =useState(1);
  const [btnText, setBtnText] =useState("");
  const [scores, setScores] = useState({
    quality: 0,
    time: 0,
    price: 0,
    privacy: 0
  });
  const [calcFinished, setCalcFinished] = useState(false);
  const [instruction,setInstruction] = useState(instructions[0]);
  const { typedText, typingDone, showCursor } = useTypingText(text, 30);
  const [showButton, setShowButton] = useState(false);
  const offset = explanations.length;
  const [background, setBackground] = useState("book");
  const [buttonOrders] = useState(() => Array.from({length: btnTexts.length}, () => shuffledRange(4)));

  useEffect(() => {
    if (page > offset) {
      setInstruction(instructions[page - offset - 1]);
    }
  }, [page]);

  useEffect(() => {
    if(page > offset){
      setButtonTexts(btnTexts[page-offset-1]);
    }
  }, [page]);

  const btnAction = (btnId : number) =>
          () => {
            setScores(prev => ({
              ...prev,
              quality: prev.quality + qualityPoints[page - offset - 1][btnId],
              time: prev.time + timePoints[page - offset - 1][btnId],
              price: prev.price + pricePoints[page - offset - 1][btnId],
              privacy: prev.privacy + privacyPoints[page - offset - 1][btnId]
            }));
            if (page < offset + btnTexts.length) {
              setPage(page + 1);
            } else {
              setCalcFinished(true);
            }
          };

  useEffect(() => {
    if (calcFinished) {
      setPage(page+1);
    }
  }, [scores.quality, calcFinished]);

  useEffect(() => {
    if (typingDone) {
      const delay = setTimeout(() => setShowButton(true), 500);

      return () => clearTimeout(delay);
    } else {
      setShowButton(false);
    }
  }, [typingDone]);

  useEffect(() => setText(explanations[page - 1]), [page]);

  const threeOptionsEval = (average: number) => {
    if (average > 66) return 0;
    if (average > 33) return 1;
    return 2;
  };

  const timeScoreEval2 = (average: number) => {
    if (average > 50) return 0;
    return 1;
  };

  const avgQuality = scores.quality / btnTexts.length;
  const avgTime = scores.time / btnTexts.length;
  const avgPrice = scores.price / btnTexts.length;
  const avgTotal = (avgQuality + avgTime + avgPrice) / btnTexts.length;
  const avgTotalWithPrivacy = avgTotal * scores.privacy;

  const choices = [
    threeOptionsEval(avgQuality),
    timeScoreEval2(avgTime),
    threeOptionsEval(avgPrice),
    threeOptionsEval(avgTotal)
  ];

  useEffect(() => setBtnText(conclusion[choices[3]]), [typingDone]);

  const assembleSummaryText = () => {
    const assembled = finalMessage
            .map((msg, i) => msg + " "+(evalChoices[i]?.[choices[i]] ?? ''))
            .join(' ');

    return assembled;

  };

  const retry = () => {
    setButtonTexts(btnTexts[1]);
    setInstruction(instructions[0]);
    setScores({ quality: 0, time: 0, price: 0 , privacy: 0});
    setCalcFinished(false);
    setPage(3);

  };


  const action = () => {
    if(page < offset + btnTexts.length){
      setPage(page+1);
    }
    else if(choices[3] === 2){
      retry();
    }else{
      setTotalPoints((prev : number) => prev+avgTotalWithPrivacy);
      setStage("game");
    }
  };


  useEffect(() => {
    if (page === offset + 1 + btnTexts.length) {
      setText(assembleSummaryText());
    }
  }, [page]);


  const texts =  () => {
      if (page < offset+1) {
        if(background != "book"){
          setBackground("book");
        }
        return <>
          <Text
                  text={(typedText + (showCursor ? '|' : '')).toUpperCase()}
                  x={85}
                  y={65}
                  style={
                    new TextStyle({
                      fontFamily:'micro5',
                      fontSize:30,
                      wordWrap:true,
                      wordWrapWidth:400,
                    })}
                  anchor={{x: 0, y: 0}}
          />
          {showButton &&
                  <Button
                          x={375}
                          y={275}
                          color={0xdcc08e}
                          lineColor={0x5d3c1a}
                          width={90}
                          height={35}
                          label={"Weiter"}
                          action={action}
                  />}
        </>
      }
  };

  const buttons = () => {
    const order = buttonOrders[page-offset-1];
    if (page >= offset + 1 && page <= offset + btnTexts.length) {
      if(background != "market"){
        setBackground("market");
      }
      const btns = [];
      for (let i = 0; i < 4; i++) {
        btns.push(
                <Button
                        key={btnTexts[i][0]}
                        x={136}
                        y={86 + (i * 60)}
                        color={0xC4A484}
                        lineColor={0x5d3c1a}
                        width={272}
                        height={38}
                        label={buttonTexts[order[i]] || `Button ${i + 1}`}
                        action={btnAction(order[i])}
                />
        );
      }
      return <>
        {<Text
                text={instruction.toUpperCase()}
                x={272}
                y={25}
                style={
                  new TextStyle({
                    fontFamily:'micro5',
                    fontSize:36,
                    wordWrap:true,
                    wordWrapWidth:400,
                    fill: 0xEEEEEE
                  })}
                anchor={{ x: 0.5, y: 0.5 }}
        />}
        {btns}
      </>;
    }
  };


  const summary =  () => {
    if (page === offset + 1 + btnTexts.length) {
      if(background != "book"){
        setBackground("book");
      }
      return <>
        <Text
                text={(typedText + (showCursor ? '|' : '')).toUpperCase()}
                x={85}
                y={65}
                style={
                  new TextStyle({
                    fontFamily:'micro5',
                    fontSize:30,
                    wordWrap:true,
                    wordWrapWidth:400,
                  })}
                anchor={{x: 0, y: 0}}
        />
        {showButton &&
                <Button
                        x={235}
                        y={275}
                        width={100}
                        height={35}
                        color={0xdcc08e}
                        lineColor={0x5d3c1a}
                        label={btnText}
                        action={action}
                />}
      </>
    }
  };

  const backgrounds = () => {
    if(loaded){
      if(background === "book"){
        return (
                <Sprite
                        anchor={0.5}
                        eventMode={'static'}
                        scale={0.6}
                        texture={textures.recipeopen}
                        x={273}
                        y={210}
                />
        )
      }else if(background === "market"){
        return (
                <>
                <Sprite
                        eventMode={'static'}
                        scale={0.6}
                        texture={textures.marketBackground}
                        x={0}
                        y={-200}
                />
                <Sprite
                        anchor={0.5}
                        eventMode={'static'}
                        scale={0.45}
                        texture={textures.market}
                        x={272}
                        y={170}
                />
                </>
        )
      }
    }
  };


  return <>
    {backgrounds()}
    {texts()}
    {buttons()}
    {summary()}
  </>;
};