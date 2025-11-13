import React, {RefObject, useEffect, useMemo, useState} from "react";
import {useLoadTextures} from "../../hooks/useLoadTextures.tsx";
import {Button} from "./Button.tsx";
import {TextStyle} from "pixi.js";
import recipeOpenImg from "@/assets/cooking-sprites/recipeopen.png"
import marketImg from "@/assets/cooking-sprites/marketstand.png"
import marketBackgroundImg from "@/assets/cooking-sprites/market_background.png"
import {Sprite, Text} from "@pixi/react";
import {Stages} from "@/components/cookingGame/Stages.ts";
import {t} from "@lingui/core/macro";
import {Score} from "@/components/cookingGame/CookingGameComponent.tsx";

interface IngredientsStageProps {
  setStage: (stage: Stages) => void;
  setTotalPoints: RefObject<Map<Score, number>>;
}

export const IngredientsStage: React.FC<IngredientsStageProps> = ({setStage, setTotalPoints}) => {

  const texturePaths= useMemo(() => ({
    recipeOpen: recipeOpenImg,
    market: marketImg,
    marketBackground: marketBackgroundImg,
  }), []);


  const explanations = [
    t`First, let's buy the ingredients we need. For good pasta we need: \n\n\t1. Spaghetti\n\t2. Tomatoes\n\t3. Spices\n\t4. Cheese`,
    t`You need to consider various criteria such as cost, time and quality. \n\nBe careful about using your data to ` +
    t`achieve better results.`
  ];

  const btnTexts = [
    [t`Local supermarket, cash`, t`Vegetable delivery service`, t`Italy Retailer`, t`Discounter, with card`],
    [t`Store on the farm`, t`Vegetarian box`, t`Co-op farmers' market`, t`Market`],
    [t`Own balcony`, t`Hyped spice startup`, t`Grandma's garden `, t`Sustainable store`],
    [t`Trip to Italy`, t`Workshop on a farm`, t`in the supermarket (again)`, t`from "parmesan.com`]
  ];

  const instructions = [
    t`buy spaghetti`, t`buy tomatoes`, t`buy spices`, t`buy cheese`
  ];

  const finalMessage = [
    t`Thanks for your help, let's see:\n\n- The ingredients have a`,
    t`quality.\n- The purchase was`, t`\n- Your wallet was `, t`your decisions.`
  ];

  const evalChoices = [
    [t`Super`, t`normal`, t`bad`],
    [t`fast.`, t`slow.`],
    [t`happy about`, t`not angry with`, t`do not agree with`]
  ];

  const conclusion = [
    t`Super job`, t`Continue`, t`Try again`
  ];

  function shuffledRange(n: number): number[] {
    return Array.from({length: n}, (_, i) => i + 1)
            .sort(() => Math.random() - 0.5).map(i => i - 1);
  }

  const qualityPoints = [
    [1.0, 0.5, 2.0, -0.5], //Spaghetti
    [2.0, 1.0, -0.5, -1.0], //Tomato
    [0.0, 1.0, 1.0, 1.5], //Spices
    [2.0, 1.5, 1.0, 1.0] // Cheese
  ];

  const pricePoints = [
    [1.0, 0.5, -1.0, 1.5], //Spaghetti
    [1.0, -0.5, 3.0, 0.5], //Tomato
    [2.0, -0.5, 2.0, -0.5], //Spices
    [1.0, 1.5, 1.0, 1.0] // Cheese
  ];

  const timePoints = [
    [-0.5, 1.0, -1.0, 2.0], //Spaghetti
    [-0.5, 2.0, 1.0, 1.0], //Tomato
    [2.0, 1.0, -1.0, 0.0], //Spices
    [-3.0, -0.5, 0.0, 1.0] // Cheese
  ];

  const privacyPoints = [
    [1, -2, 0, 0], //Spaghetti
    [2, -1, 1, 2], //Tomato
    [2, -1, 2, 1], //Spices
    [2, 0, 1, -1] // Cheese
  ];

  const {textures, loaded} = useLoadTextures(texturePaths);
  const [buttonTexts, setButtonTexts] = useState(btnTexts[1]);
  const [text, setText] = useState(explanations[0]);
  const [page, setPage] = useState(1);
  const [btnText, setBtnText] = useState("");
  const [scores, setScores] = useState({
    quality: 0,
    time: 0,
    price: 0,
    privacy: 0
  });
  const [calcFinished, setCalcFinished] = useState(false);
  const [instruction, setInstruction] = useState(instructions[0]);
  const offset = explanations.length;
  const [background, setBackground] = useState("book");
  const [buttonOrders] = useState(() => Array.from({length: btnTexts.length}, () => shuffledRange(4)));

  useEffect(() => {
    if (page > offset) {
      setInstruction(instructions[page - offset - 1]);
    }
  }, [page]);

  useEffect(() => {
    if (page > offset) {
      setButtonTexts(btnTexts[page - offset - 1]);
    }
  }, [page]);

  const btnAction = (btnId: number) =>
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
      setPage(page + 1);
    }
  }, [scores.quality, calcFinished]);


  useEffect(() => setText(explanations[page - 1]), [page]);

  const threeOptionsEval = (average: number) => {
    if (average > 1) return 0;
    if (average > 0) return 1;
    return 2;
  };

  const timeScoreEval2 = (average: number) => {
    if (average > 2.5) return 0;
    return 1;
  };

  const len = btnTexts.length;

  const avgQuality = scores.quality / len;
  const avgTime = scores.time / len;
  const avgPrice = scores.price / len;
  const avgPrivacy = scores.privacy / len;

  const totalPrivacy = avgPrivacy * 5;
  const totalComfort = (avgQuality + avgTime + avgPrice) / len * 5;

  const avgTotal = (avgQuality + avgTime + avgPrice) / len;

  const choices = [
    threeOptionsEval(avgQuality),
    timeScoreEval2(avgTime),
    threeOptionsEval(avgPrice),
    threeOptionsEval(avgTotal)
  ];

  useEffect(() => setBtnText(conclusion[choices[3]]));

  const assembleSummaryText = () => {
    const assembled = finalMessage
            .map((msg, i) => msg + " " + (evalChoices[i]?.[choices[i]] ?? ''))
            .join(' ');

    return assembled;

  };

  const retry = () => {
    setButtonTexts(btnTexts[1]);
    setInstruction(instructions[0]);
    setScores({quality: 0, time: 0, price: 0, privacy: 0});
    setCalcFinished(false);
    setPage(3);

  };


  const action = () => {
    if (page < offset + btnTexts.length) {
      setPage(page + 1);
    } else if (choices[3] === 2) {
      retry();
    } else {
      const setPoints = setTotalPoints.current;
      if (setPoints) {
        setPoints.set(Score.Privacy, totalPrivacy);
        setPoints.set(Score.Comfort, totalComfort);
      }
      setStage(Stages.GAME);
    }
  };

  useEffect(() => {
  }, [loaded]);

  useEffect(() => {
    if (page === offset + 1 + btnTexts.length) {
      setText(assembleSummaryText());
    }
  }, [page]);


  const texts = () => {
    if (page < offset + 1) {
      if (background != "book") {
        setBackground("book");
      }
      return <>
        <Text
                text={text.toUpperCase()}
                x={85}
                y={65}
                style={
                  new TextStyle({
                    fontFamily: 'LoResRegular',
                    fontSize: 24,
                    wordWrap: true,
                    wordWrapWidth: 400,
                  })}
                anchor={{x: 0, y: 0}}
        />

        <Button
                x={375}
                y={275}
                color={0xdcc08e}
                lineColor={0x5d3c1a}
                width={90}
                height={35}
                label={"Weiter"}
                action={action}
        />
      </>
    }
  };

  const buttons = () => {
    const order = buttonOrders[page - offset - 1];
    if (page >= offset + 1 && page <= offset + btnTexts.length) {
      if (background != "market") {
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
                y={30}
                style={
                  new TextStyle({
                    fontFamily: 'LoResRegular',
                    fontSize: 20,
                    wordWrap: true,
                    wordWrapWidth: 400,
                    fill: 0xEEEEEE
                  })}
                anchor={{x: 0.5, y: 0.5}}
        />}
        {btns}
      </>;
    }
  };


  const summary = () => {
    if (page === offset + 1 + btnTexts.length) {
      if (background != "book") {
        setBackground("book");
      }
      return <>
        {text && <Text
                text={text.toUpperCase()}
                x={85}
                y={65}
                style={
                  new TextStyle({
                    fontFamily: 'LoResRegular',
                    fontSize: 24,
                    wordWrap: true,
                    wordWrapWidth: 400,
                  })}
                anchor={{x: 0, y: 0}}
        />}

        <Button
                x={235}
                y={275}
                width={100}
                height={35}
                color={0xdcc08e}
                lineColor={0x5d3c1a}
                label={btnText}
                action={action}
        />
      </>
    }
  };

  const backgrounds = () => {
    if (loaded) {
      if (background === "book") {
        return (
                <Sprite
                        anchor={0.5}
                        eventMode={'static'}
                        scale={0.6}
                        texture={textures.recipeOpen}
                        x={272}
                        y={210}
                />
        )
      } else if (background === "market") {
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