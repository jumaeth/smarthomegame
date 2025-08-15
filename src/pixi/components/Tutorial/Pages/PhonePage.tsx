import React, {KeyboardEvent, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics, Sprite, Text} from "@pixi/react";
import phoneImage from "@/assets/tutorial/phonePage/phone.png";
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



export const PhonePage: React.FC<PageProps> = ({
       windowWidth,
       windowHeight,
       keyControl,
       setKeyControl,
       setSpotLightAnimation
           }: PropsWithChildren<PageProps>) => {

  const texture = useMemo(() => loadTexture(phoneImage), []);
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
          "The help app", "Want to see this tutorial again or find out how to control the game? - Use the help app!",
          "The progress app", "Use this app to check on the smart devices and your overall progress within the game",
          "The settings", "Use this app to change the settings, including language, sound or touch controls",
          "The smart assistant", "Want to learn more about a topic? Use this app to talk to an expert in Data Security" +
          " – The Datapro LLM!", "The Phone"

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


  //----------user input----------

  //keyControls
  useEffect(() => {
    if(keyControl != Pages.Smartphone || animating)return;

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
            startX: 0.04 * windowWidth, startY: windowHeight * 0.1,
            endX: windowWidth * 0.5, endY: windowHeight * 0.5,
            startS: 0.25, endS: 1, showOthers: true, duration: 750
          } as GrowProps

          await runGrowAnimation(sprite, anim1);
          setAnimation(0);
          setShowExpl(true);
          break;
        case 2:
          const anim2 = {
            startX: windowWidth * 0.5, startY: windowHeight * 0.5,
            endX: 0.04 * windowWidth, endY: windowHeight * 0.1,
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

    setupTexts(textsTemp[0], windowWidth*0.12, windowHeight*0.2, 0.035, "bold", 0.3);
    setupTexts(textsTemp[2], windowWidth*0.14, windowHeight*0.7, 0.035, "bold", 0.3);
    setupTexts(textsTemp[4], windowWidth*0.725, windowHeight*0.3, 0.035, "bold", 0.3);
    setupTexts(textsTemp[6], windowWidth*0.75, windowHeight*0.75, 0.035, "bold", 0.3);

    setupTexts(textsTemp[1], windowWidth*0.188, windowHeight*0.265, 0.025, "lighter", 0.25);
    setupTexts(textsTemp[3], windowWidth*0.2, windowHeight*0.755, 0.025, "lighter", 0.3);
    setupTexts(textsTemp[5], windowWidth*0.785, windowHeight*0.365, 0.025, "lighter", 0.28);
    setupTexts(textsTemp[7], windowWidth*0.8125, windowHeight*0.815, 0.025, "lighter", 0.3);

    setupTexts(textsTemp[8], windowWidth*0.5, windowHeight*0.125, 0.06, "bold", 0.3);

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