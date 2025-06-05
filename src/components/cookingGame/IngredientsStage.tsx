import {useEffect, useState} from "react";
import {useLoadTextures} from "../../hooks/useLoadTextures.tsx";
import {Button} from "./Button.tsx";
import {useTypingText} from "../../hooks/useTypingText.tsx";

export const IngredientsStage = ({ setStage, dimensions }) => {


  const texturePaths: { [key: string]: string } = {
    recipeopen: "/cooking-sprites/recipeopen.png",
    market: "/cooking-sprites/marketstand.png"
  };

  const explanations = [
          "This is the explanation on the first page that requires some explanation about the explanation",
          "This is the page2 explanation which is an ultimate explanation explanation"
  ];

  const btnTexts = [
    ["page1", "text2", "text3", "text4"],
    ["page2", "text2", "text3", "text4"],
    ["page3", "text2", "text3", "text4"]
  ];

  const instructions = [
          "instruction 1", "instruction 2", "instruction 3"
  ];

  const finalMessage = [
          "Thanks for your help, lets see:\n\n- The ingredients have an",
          "quality.\n- Shopping could be done", "\n- Your wallet", "your choices."
  ];

  const evalChoices = [
          ["great", "average", "bad"],
          ["quickly.", "slowly."],
          ["was happy about", "couldn't complain about", "wouldn't agree"]
  ];

  const conclusion = [
    "Great job", "Move on", "Try again"
  ];

  function shuffledRange(n: number): number[] {
    return  Array.from({ length: n }, (_, i) => i + 1)
            .sort(() => Math.random() - 0.5).map(i => i-1);
  }

  const qualityPoints = [
    [100,75, 50, 25],
    [100,75, 50, 25],
    [100,75, 50, 25]
  ];

  const pricePoints = [
    [100,75, 50, 25],
    [100,75, 50, 25],
    [100,75, 50, 25]
  ];

  const timePoints = [
    [100,75, 50, 25],
    [100,75, 50, 25],
    [100,75, 50, 25]
  ];

  const {textures, loaded} = useLoadTextures(texturePaths);
  const [buttonTexts, setButtonTexts] = useState(btnTexts[1]);
  const [text, setText] = useState(explanations[0]);
  const [page, setPage] =useState(1);
  const [btnText, setBtnText] =useState("");
  const [scores, setScores] = useState({
    quality: 0,
    time: 0,
    price: 0
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

  const btnAction = btnId =>
          () => {
            setScores(prev => ({
              ...prev,
              quality: prev.quality + qualityPoints[page - offset - 1][btnId],
              time: prev.time + timePoints[page - offset - 1][btnId],
              price: prev.price + pricePoints[page - offset - 1][btnId]
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
  const avgTotal = (avgQuality + avgTime + avgPrice) / 3;

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
    setScores({ quality: 0, time: 0, price: 0 });
    setCalcFinished(false);
    setPage(3);

  };


  const action = () => {
    if(page < offset + btnTexts.length){
      return setPage(page+1);
    }
    else if(choices[3] === 2){
      retry();
    }else{
      return setStage("game");
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
          <pixiText
                  text={(typedText + (showCursor ? '|' : '')).toUpperCase()}
                  x={dimensions.width * 0.15}
                  y={dimensions.height * 0.2}
                  style={{
                    fontFamily: 'micro5',
                    fontSize: 30,
                    wordWrap: true,
                    wordWrapWidth: 400,
                  }}
                  anchor={{x: 0, y: 0}}
          />
          {showButton &&
                  <Button
                          x={dimensions.width * 0.7}
                          y={dimensions.height * 0.85}
                          width={90}
                          height={35}
                          label={"next"}
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
                        key={i}
                        x={dimensions.width * 0.25}
                        y={dimensions.height * (0.3 + i * 0.2)}
                        width={dimensions.width * 0.5}
                        height={dimensions.height * 0.1}
                        label={buttonTexts[order[i]] || `Button ${i + 1}`}
                        action={btnAction(order[i])}
                />
        );
      }
      return <>
        {<pixiText
                text={instruction.toUpperCase()}
                x={dimensions.width*0.5}
                y={dimensions.height*0.08}
                style={{
                  fontFamily: 'micro5',
                  fontSize: 36,
                  wordWrap: true,
                  wordWrapWidth: 400,
                  fill: 0xffffff
                }}
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
        <pixiText
                text={(typedText + (showCursor ? '|' : '')).toUpperCase()}
                x={dimensions.width * 0.15}
                y={dimensions.height * 0.15}
                style={{
                  fontFamily: 'micro5',
                  fontSize: 30,
                  wordWrap: true,
                  wordWrapWidth: 400,
                }}
                anchor={{x: 0, y: 0}}
        />
        {showButton &&
                <Button
                        anchor={{x: 0.5, y:0.5}}
                        x={dimensions.width * 0.4}
                        y={dimensions.height * 0.85}
                        width={dimensions.width * 0.2}
                        height={dimensions.height*0.1}
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
                <pixiSprite
                        anchor={0.5}
                        eventMode={'static'}
                        scale={0.6}
                        texture={textures.recipeopen}
                        x={dimensions.width*0.5}
                        y={dimensions.height*0.68}
                />
        )
      }else if(background === "market"){
        return (
                <pixiSprite
                        anchor={0.5}
                        eventMode={'static'}
                        scale={0.45}
                        texture={textures.market}
                        x={dimensions.width*0.5}
                        y={dimensions.height*0.55}
                />
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