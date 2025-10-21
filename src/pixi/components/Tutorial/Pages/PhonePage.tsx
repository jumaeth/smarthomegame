import React, {PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics, Sprite, Text} from "@pixi/react";
import phoneImage from "@/assets/tutorial/phonePage/phone.png";
import {loadTexture} from "@/utils/loadTexture.ts";
import {Container as PixiContainer, Graphics as PixiGraphics, Sprite as PixiSprite, TextStyle} from "pixi.js";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {growAnimation, GrowProps} from "@/pixi/components/Tutorial/anim/growAnimation.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {toggleExplanations} from "@/pixi/components/Tutorial/util/drawings.tsx";
import {useAnimationManager} from "@/hooks/tutorial/useAnimationManager.tsx";
import {fadeAnimation} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {FADE_IN, FADE_OUT} from "@/pixi/components/Tutorial/util/AnimProps.ts";
import {PageOrder} from "@/pixi/components/Tutorial/util/PageOrder.ts";
import {TextProps} from "@/pixi/components/Tutorial/util/Types.ts";
import {t} from "@lingui/core/macro";


export const PhonePage: React.FC<PageProps> = ({
       windowWidth,
       windowHeight,
       keyControl,
       setKeyControl,
       setNextPage
           }: PropsWithChildren<PageProps>) => {

  const enum Animations { GROW, SHRINK, END}

  //memo
  const texture = useMemo(() => loadTexture(phoneImage), []);

  //state
  const [animation, setAnimation] = useState(Animations.GROW);
  const [allTexts, setAllTexts] = useState<TextProps[]>([]);
  const [onLoad, setOnLoad] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [showChar, setShowChar] = useState(true);

  //refs
  const charRef = useRef<PixiSprite | null >(null);
  const textRef = useRef<PixiContainer|null>(null);
  const mgrRef = useAnimationManager();
  const graphicRef = useRef<PixiContainer|null>(null);


  const textArr  = useMemo( () => [
    t`The help app`,
    t`Want to see this tutorial again or find out how to control the game? - Use the help app!`,
    t``,
    t``,
    t`The settings`,
    t`Use this app to change the settings, including language, sound or touch controls`,
    t``,
    t``,
    t`The Phone`

], [])

  //hide explanations  on init
  useLayoutEffect(() => {
    const text = textRef.current;
    const graphic = graphicRef.current;
    if (!text || !graphic)return;
    toggleExplanations([text, graphic], false);
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
          const growChar = {
            startX: 0.04 * windowWidth, startY: windowHeight * 0.1,
            endX: windowWidth * 0.5, endY: windowHeight * 0.5,
            startS: 0.25, endS: 1, showOthers: true, duration: 750
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
            startX: windowWidth * 0.5, startY: windowHeight * 0.5,
            endX: 0.04 * windowWidth, endY: windowHeight * 0.1,
            startS: 1, endS: 0.275, showOthers: false, duration: 750
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
          setNextPage(PageOrder.DECISION);
          setAnimating(true);
          setShowChar(false);
          break;
      }
    };

    run();

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [animation, Animations.END, Animations.GROW, Animations.SHRINK, mgrRef, setKeyControl, setNextPage, windowWidth, windowHeight]);



  //keyControls
  useEffect(() => {
    if(keyControl != Pages.SMARTPHONE || animating)return;

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
  }, [keyControl, animating, Animations.SHRINK]);

  //setup graphics
  const setupTexts = useCallback( ()=> {
    setAllTexts(prev => [
      ...prev,
      { text: textArr[0], x: windowWidth*0.12,   y: windowHeight*0.2,  fontSize: 0.035, fontWeight: "bold"   },
      { text: textArr[2], x: windowWidth*0.14, y: windowHeight*0.7,  fontSize: 0.035, fontWeight: "bold"   },
      { text: textArr[4], x: windowWidth*0.725, y: windowHeight*0.3,  fontSize: 0.035, fontWeight: "bold"   },
      { text: textArr[6], x: windowWidth*0.75, y: windowHeight*0.75,  fontSize: 0.035, fontWeight: "bold"   },

      { text: textArr[1], x: windowWidth*0.188,   y: windowHeight*0.265,  fontSize: 0.025, fontWeight: "lighter", wrap: 0.25},
      { text: textArr[3], x: windowWidth*0.2, y: windowHeight*0.755,  fontSize: 0.025, fontWeight: "lighter"},
      { text: textArr[5], x: windowWidth*0.785,   y: windowHeight*0.365,  fontSize: 0.025, fontWeight: "lighter", wrap: 0.28},
      { text: textArr[7], x: windowWidth*0.8125, y: windowHeight*0.815,  fontSize: 0.025, fontWeight: "lighter"},

      { text: textArr[8], x: windowWidth*0.5, y: windowHeight*0.125, fontSize: 0.06, fontWeight: "bold" },
    ]);
  },[textArr, windowWidth, windowHeight])

  //init graphics/texts
  useEffect(() => {
    if (onLoad) {
      setupTexts();
      setOnLoad(false);
    }
  }, [onLoad, setupTexts]);

  //define line properties
  const drawLines =  useCallback( (g: PixiGraphics) => {
    g.clear();

    //top left
    g.lineStyle(5, "#135690", 1);
    g.moveTo(windowWidth*0.4475, windowHeight*0.395);
    g.lineTo(windowWidth*0.275, windowHeight*0.3);

    //bottom left
    g.lineStyle(6, "#1C557D", 1);
    g.moveTo(windowWidth*0.45, windowHeight*0.46);
    g.lineTo(windowWidth*0.225, windowHeight*0.675);

    //bottom right
    g.lineStyle(6, "#7CB3D3", 1);
    g.moveTo(windowWidth*0.55, windowHeight*0.475);
    g.lineTo(windowWidth*0.7, windowHeight*0.7);

    //top right
    g.lineStyle(5, "#EB992E", 1);
    g.moveTo(windowWidth*0.55, windowHeight*0.34);
    g.lineTo(windowWidth*0.655, windowHeight*0.3);

  }, [windowWidth, windowHeight])


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
              {allTexts.map((text: TextProps, i) => (
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