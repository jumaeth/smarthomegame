import React, {KeyboardEvent, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics, Sprite, Text} from "@pixi/react";
import scoresImage from "@/assets/tutorial/scoresPage/scores.png";
import {loadTexture} from "@/utils/loadTexture.ts";
import {
  Container as PixiContainer,
  Graphics as PixiGraphics,
  Sprite as PixiSprite,
  Text as PixiText,
  TextStyle,
  TextStyleFontWeight
} from "pixi.js";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {AnimationManager} from "@/pixi/components/Tutorial/anim/AnimationManager.ts";
import {growAnimation, GrowProps} from "@/pixi/components/Tutorial/anim/growTween.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";


export const ScoresPage: React.FC<PageProps> = ({
       windowWidth,
       windowHeight,
       keyControl,
       setKeyControl,
       setSpotLightAnimation
           }: PropsWithChildren<PageProps>) => {

  const texture = useMemo(() => loadTexture(scoresImage), []);
  const charRef = useRef<PixiSprite | null >(null);
  const [animation, setAnimation] = useState(1);
  const [showExpl, setShowExpl] = useState(false);
  const [pixiTexts, setPixiTexts] = useState([]);
  const conRef = useRef<PixiContainer|null>(null);
  const [onLoad, setOnLoad] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [showChar, setShowChar] = useState(true);
  const mgrRef = useRef<AnimationManager | null>(null);


  const textsTemp = [
          "Your privacy score", "It indicates the safety of your data. Evil attackers always try to steal your data and" +
          " use it to attack you and your personal space. A high privacy score makes it harder for them!",
          "Your comfort score", "A smarthome does a great deal to make your life more comfortable. It can automate" +
          " routines or know your prefferences even better than yourself. A high comfort score makes your life easier!",
          "The scores"
  ]

  //----------init----------

  //init graphics/texts
  useEffect(() => {
    if (onLoad) {
      drawTexts();
      setOnLoad(false);
    }
  }, [onLoad]);



  //----------animations----------

  //cleanup animations
  useEffect(() => {
    mgrRef.current = new AnimationManager();
    return () => mgrRef.current?.cancelAll();
  }, []);

  //run grow/shrink animation
  const runGrowAnimation = async (sprite: PixiSprite, growProps: GrowProps) => {
    const mgr = mgrRef.current!;

    await mgr.sequence([
      () => growAnimation(mgr, sprite, growProps),
    ]);
  };

  //manage animations
  useEffect(() => {
    if (!mgrRef.current) return;

    let timeoutId: number | undefined;
    let cancelled = false;
    const sprite = charRef.current;
    if (!sprite) return;

    const run = async () => {
      switch (animation) {
        case 1:
          const anim1 = {
            startX: 0.9275 * windowWidth, startY: windowHeight * 0.063,
            endX: windowHeight, endY: windowHeight * 0.3,
            startS: 0.275, endS: 1, showOthers: true, duration: 750
          } as GrowProps

          await runGrowAnimation(sprite, anim1);
          setAnimation(0);
          setShowExpl(true);
          break;
        case 2:
          const anim2 = {
            startX: windowHeight, startY: windowHeight * 0.3,
            endX: 0.9275 * windowWidth, endY: windowHeight * 0.063,
            startS: 1, endS: 0.275, showOthers: false, duration: 750
          } as GrowProps

          setShowExpl(false);
          await runGrowAnimation(sprite, anim2);
          setAnimation(3);
          break;
        case 3:
          setKeyControl(Pages.Main);
          setSpotLightAnimation(3);
          setAnimating(true);
          setShowChar(false);
          break;
      }
    };

    run();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [animation]);


  //----------user input----------

  //keyControls
  useEffect(() => {
    if(keyControl != Pages.Scores || animating)return;

    const onSpecialPressed = (e: KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          setAnimation(2);
      }
    }

    const events = [onSpecialPressed];

    events.forEach(func => window.addEventListener("keydown", func));
    return () => {
      events.forEach(func => window.removeEventListener("keydown", func));
    };
  }, [keyControl, animating]);



  //----------drawings----------

  //store line properties in pixiGraphic
  const setupTexts = (text: string, x: number, y: number, fontSize: number, fontWeight: TextStyleFontWeight, wrap: number) => {
    const t1 = new PixiText();
    t1.text = text;
    t1.x = x;
    t1.y = y;
    t1.style = new TextStyle({
      fontSize: Math.min(windowWidth, windowHeight) * fontSize,
      fontWeight: fontWeight,
      wordWrapWidth: windowWidth * wrap
    })

    setPixiTexts(prev => [...prev, t1]);

  }

  //define text properties
  const drawTexts = () => {

    const c = new PixiContainer();

    setupTexts(textsTemp[0], windowWidth*0.2, windowHeight*0.6, 0.04, "bold", 0.3);
    setupTexts(textsTemp[2], windowWidth*0.67, windowHeight*0.625, 0.04, "bold", 0.3);

    setupTexts(textsTemp[1], windowWidth*0.2525, windowHeight*0.71, 0.03, "lighter", 0.3);
    setupTexts(textsTemp[3], windowWidth*0.7425, windowHeight*0.73, 0.03, "lighter", 0.36);

    setupTexts(textsTemp[6], windowWidth*0.5+TILE_SIZE*3, windowHeight*0.25, 0.07, "bold", 0.3);

    pixiTexts.forEach(t => c.addChild(t));
    c.width = windowWidth;
    c.height = windowHeight;
    c.x = 0;
    c.y = 0;
    conRef.current = c;
  }

  //define line properties
  const drawLines =  useCallback( (g: PixiGraphics) => {
    g.clear();

    //left
    g.lineStyle(7, "#f0b100", 1);
    g.moveTo(windowWidth*0.175, windowHeight*0.55);
    g.bezierCurveTo(windowWidth*0.2, windowHeight*0.225, windowWidth*0.3, windowHeight*0.225, windowWidth*0.3, windowHeight*0.22);

    //right
    g.lineStyle(6, "#f0b100", 1);
    g.moveTo(windowWidth*0.55, windowHeight*0.725);
    g.bezierCurveTo(windowWidth*0.475, windowHeight*0.67, windowWidth*0.405, windowHeight*0.525, windowWidth*0.4, windowHeight*0.5);

  }, [])

  //stranslate lines to react
  const lines = () => {
    return (<Graphics draw={drawLines}/>)
  }

  //translate texts to react
  const texts = () => {
    return (
            <Container>
              {pixiTexts.map((msg, i) => (
                      <Text
                              key={i}
                              text={msg.text}
                              x={msg.x}
                              y={msg.y}
                              anchor={0.5}
                              style={new TextStyle({
                                fontFamily: "LoResRegular",
                                fontSize: msg.style.fontSize,
                                fontWeight: msg.style.fontWeight,
                                fill: "#FFFFFF",
                                align: "left",
                                wordWrap: true,
                                wordWrapWidth: msg.style.wordWrapWidth
                              })
                              }
                      />
              ))}
            </Container>
    )
  }

  return (
      <>
        {showChar && texture && <Sprite
          texture={texture}
          ref={charRef}
        />}
        {showExpl && lines()}
        {showExpl && texts()}
      </>
  )
};