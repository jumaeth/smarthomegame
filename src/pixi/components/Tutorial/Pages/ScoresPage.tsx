import React, {PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics, Sprite, Text} from "@pixi/react";
import scoresImage from "@/assets/tutorial/scoresPage/scores.png";
import {loadTexture} from "@/utils/loadTexture.ts";
import {Container as PixiContainer, Graphics as PixiGraphics, Sprite as PixiSprite, TextStyle} from "pixi.js";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {growAnimation, GrowProps} from "@/pixi/components/Tutorial/anim/growAnimation.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {TextProps} from "@/pixi/components/Tutorial/util/Types.ts";
import {GROW_DURATION} from "@/pixi/components/Tutorial/util/Constants.ts";
import {toggleExplanations} from "@/pixi/components/Tutorial/util/drawings.tsx";
import {fadeAnimation} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {FADE_IN, FADE_OUT} from "@/pixi/components/Tutorial/util/AnimProps.ts";
import {PageOrder} from "@/pixi/components/Tutorial/Tutorial.tsx";
import {useAnimationManager} from "@/hooks/tutorial/useAnimationManager.tsx";


export const ScoresPage: React.FC<PageProps> = ({
       windowWidth,
       windowHeight,
       keyControl,
       setKeyControl,
       setNextPage
           }: PropsWithChildren<PageProps>) => {

  const enum Animations { GROW, SHRINK, END}

  //memo
  const texture = useMemo(() => loadTexture(scoresImage), []);

  //state
  const [allTexts, setAllTexts] = useState<TextProps[]>([]);
  const [onLoad, setOnLoad] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [showChar, setShowChar] = useState(true);
  const [animation, setAnimation] = useState(Animations.GROW);

  //refs
  const graphicRef = useRef<PixiContainer|null>(null);
  const mgrRef = useAnimationManager();
  const textRef = useRef<PixiContainer|null>(null);
  const charRef = useRef<PixiSprite | null >(null);


  //others
  const textArr = [
          "Your privacy score", "It indicates the safety of your data. Evil attackers always try to steal your data and" +
          " use it to attack you and your personal space. A high privacy score makes it harder for them!",
          "Your comfort score", "A smarthome does a great deal to make your life more comfortable. It can automate" +
          " routines or know your prefferences even better than yourself. A high comfort score makes your life easier!",
          "The scores"
  ]

  //init graphics/texts
  useEffect(() => {
    if (onLoad) {
      setupTexts();
      setOnLoad(false);
    }
  }, [onLoad]);

  //hide explanations  on init
  useLayoutEffect(() => {
    if (!textRef.current || !graphicRef.current)return;
    toggleExplanations([textRef.current, graphicRef.current], false);
  }, []);

  //manage animations
  useEffect(() => {
    let timeoutId: number | undefined;

    const mgr = mgrRef.current!;
    const sprite = charRef.current;
    const texts = textRef.current;
    const graphics = graphicRef.current;
    if (!sprite || !mgr || !texts ||  !graphics) return;

    const run = async () => {
      switch (animation) {

        case Animations.GROW: {
          const growChar= {
            startX: 0.9275 * windowWidth, startY: windowHeight * 0.063,
            endX: windowWidth  * 0.55, endY: windowHeight * 0.3,
            startS: 0.275, endS: 1, showOthers: true, duration: GROW_DURATION
          } as GrowProps

          setAnimating(true);
          await mgr.sequence([() => growAnimation(mgr, sprite, growChar)]);
          toggleExplanations([texts, graphics], true);
          await mgr.parallel([() => fadeAnimation(mgr, [texts, graphics], FADE_IN)]);
          setAnimating(false);
          break;
        }

        case Animations.SHRINK: {
          const shrinkChar = {
            startX: windowWidth * 0.55, startY: windowHeight * 0.3,
            endX: 0.9275 * windowWidth, endY: windowHeight * 0.063,
            startS: 1, endS: 0.275, showOthers: false, duration: GROW_DURATION
          } as GrowProps

          setAnimating(true);
          await mgr.parallel([
            () => fadeAnimation(mgr, [texts, graphics], FADE_OUT),
            () => growAnimation(mgr, sprite, shrinkChar)]);
          setAnimating(false);
          toggleExplanations([texts, graphics], false);
          setAnimation(Animations.END);
          break;
        }

        case Animations.END:
          setKeyControl(Pages.MAIN);
          setNextPage(PageOrder.PHONE);
          setAnimating(true);
          setShowChar(false);
          break;
      }
    };

    run();

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [animation]);


  //keyControls
  useEffect(() => {
    if(keyControl != Pages.SCORES || animating)return;

    const onSpecialPressed = (e: globalThis.KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          setAnimation(Animations.SHRINK);
      }
    }

    const events = [onSpecialPressed];

    events.forEach(func => window.addEventListener("keydown", func));
    return () => {
      events.forEach(func => window.removeEventListener("keydown", func));
    };
  }, [keyControl, animating]);


  //setup graphics
  const setupTexts = () => {
    setAllTexts(prev => [
      ...prev,
      { text: textArr[0], x: windowWidth*0.2,   y: windowHeight*0.6,  fontSize: 0.04, fontWeight: "bold"   },
      { text: textArr[2], x: windowWidth*0.67, y: windowHeight*0.625,  fontSize: 0.04, fontWeight: "bold"   },
      { text: textArr[1], x: windowWidth*0.2525,   y: windowHeight*0.71,  fontSize: 0.03, fontWeight: "lighter"},
      { text: textArr[3], x: windowWidth*0.7425, y: windowHeight*0.73,  fontSize: 0.03, fontWeight: "lighter", wrap: 0.36},
      { text: textArr[4], x: windowWidth*0.55+TILE_SIZE*3, y: windowHeight*0.1, fontSize: 0.07, fontWeight: "bold" },
    ]);
  };

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

  const lines = () => {
    return (
            <Container ref={graphicRef}>
              <Graphics draw={drawLines}/>
            </Container>
    )
  }

  const texts = () => {
    return (
            <Container ref={textRef}>
              {allTexts.map((text, i) => (
                      <Text
                              key={i}
                              text={text.text}
                              x={text.x}
                              y={text.y}
                              anchor={0.5}
                              style={new TextStyle({
                                fontFamily: "LoResRegular",
                                fontSize: Math.min(windowWidth, windowHeight) * text.fontSize,
                                fontWeight: text.fontWeight,
                                fill: "#FFFFFF",
                                align: "left",
                                wordWrap: true,
                                wordWrapWidth: text.wrap ? windowWidth * text.wrap : windowWidth * 0.3
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
        {lines()}
        {texts()}
      </>
  )
};