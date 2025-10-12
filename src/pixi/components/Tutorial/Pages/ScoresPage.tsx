import React, {PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics, Sprite, Text} from "@pixi/react";
import scoresImage from "@/assets/tutorial/scoresPage/scores.png";
import {loadTexture} from "@/utils/loadTexture.ts";
import {Container as PixiContainer, Graphics as PixiGraphics, Sprite as PixiSprite, TextStyle} from "pixi.js";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {growAnimation, GrowProps} from "@/pixi/components/Tutorial/anim/growAnimation.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {TextProps} from "@/pixi/components/Tutorial/util/Types.ts";
import {GROW_DURATION} from "@/pixi/components/Tutorial/util/Constants.ts";
import {toggleExplanations} from "@/pixi/components/Tutorial/util/drawings.tsx";
import {fadeAnimation} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {FADE_IN, FADE_OUT} from "@/pixi/components/Tutorial/util/AnimProps.ts";
import {PageOrder} from "@/pixi/components/Tutorial/util/PageOrder.ts";
import {useAnimationManager} from "@/hooks/tutorial/useAnimationManager.tsx";
import {t} from "@lingui/core/macro";


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
  const textArr  = useMemo( () => [
    t`Your privacy score`,
    t`It indicates the safety of your data. Evil attackers always try to steal your data and use it to attack you and your personal space. A high privacy score makes it harder for them!`,
    t`Your comfort score`,
    t`A smarthome does a great deal to make your life more comfortable. It can automate routines or know your preferences even better than yourself. A high comfort score makes your life easier!`,
    t`The scores`
  ], [])

  //hide explanations  on init
  useLayoutEffect(() => {
    if (!textRef.current || !graphicRef.current)return;
    toggleExplanations([textRef.current, graphicRef.current], false);
  }, []);

  const growChar= {
    startX: 0.9275 * windowWidth, startY: windowHeight * 0.08,
    endX: windowWidth  * 0.55, endY: windowHeight * 0.3,
    startS: Math.min(windowWidth, windowHeight) / 3600, endS: Math.min(windowWidth, windowHeight) / 1000, showOthers: true, duration: GROW_DURATION
  } as GrowProps

  const shrinkChar = {
    startX: windowWidth * 0.55, startY: windowHeight * 0.3,
    endX: 0.9275 * windowWidth, endY: windowHeight * 0.063,
    startS:  Math.min(windowWidth, windowHeight) / 1000, endS: Math.min(windowWidth, windowHeight) / 3600, showOthers: false, duration: GROW_DURATION
  } as GrowProps

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

          setAnimating(true);
          await mgr.sequence([() => growAnimation(mgr, sprite, growChar)]);
          toggleExplanations([texts, graphics], true);
          await mgr.parallel([() => fadeAnimation(mgr, [texts, graphics], FADE_IN)]);
          setAnimating(false);
          break;
        }

        case Animations.SHRINK: {

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
  }, [animation, Animations.END, Animations.GROW, Animations.SHRINK, mgrRef, setKeyControl, setNextPage]);

  useEffect(() => {
    const sprite = charRef.current
    if(!sprite || animating)return;
    sprite.x = growChar.endX
    sprite.y = growChar.endY
    sprite.scale.set(growChar.endS)
  }, [windowWidth, windowHeight]);

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
  }, [keyControl, animating, Animations.SHRINK]);


  //setup graphics
  const textsData = useMemo<TextProps[]>(() => [
      { text: textArr[0], x: windowWidth*0.1,   y: windowHeight*0.6,  fontSize: 0.04, fontWeight: "bold" },
      { text: textArr[2], x: windowWidth*0.575, y: windowHeight*0.625,  fontSize: 0.04, fontWeight: "bold" },
      { text: textArr[1], x: windowWidth*0.1025,   y: windowHeight*0.65,  fontSize: 0.03, fontWeight: "lighter"},
      { text: textArr[3], x: windowWidth*0.5775, y: windowHeight*0.675,  fontSize: 0.03, fontWeight: "lighter", wrap: 0.36},
      { text: textArr[4], x: growChar.endX - texture.width * growChar.endS * 0.1, y: windowHeight*0.05, fontSize: 0.07, fontWeight: "bold" },
    ],[windowWidth, windowHeight]);

  const drawLines =  useCallback( (g: PixiGraphics) => {
    g.clear();

    const img = {
      width: texture.width <= 1 ? 868 * growChar.endS: texture.width * growChar.endS,
      height: texture.height <= 1 ? 374 * growChar.endS : texture.height * growChar.endS
    };

    //left
    g.lineStyle(Math.min(windowWidth, windowHeight) / 90, "#f0b100", 1);
    g.moveTo(textsData[0].x + windowWidth * 0.05, textsData[0].y - windowHeight * 0.05);
    g.bezierCurveTo(
            growChar.endX - img.width * 0.85,growChar.endY  + img.height * 0.2,
            growChar.endX - img.width * 0.65,growChar.endY  - img.height * 0.2,
            growChar.endX - img.width * 0.55,growChar.endY  - img.height * 0.25
    )

    //right
    g.lineStyle(Math.min(windowWidth, windowHeight) / 90, "#f0b100", 1);
    g.moveTo(textsData[1].x - windowWidth * 0.025, textsData[1].y + windowHeight * 0.1);
    g.bezierCurveTo(
            growChar.endX - img.width * 0.1,growChar.endY  + img.height * 1.1,
            growChar.endX - img.width * 0.25,growChar.endY  + img.height * 0.9,
            growChar.endX - img.width * 0.325,growChar.endY  + img.height * 0.6
    )

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
              {textsData.map((text, i) => (
                      <Text
                              key={i}
                              text={text.text}
                              x={text.x}
                              y={text.y}
                              anchor={0}
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