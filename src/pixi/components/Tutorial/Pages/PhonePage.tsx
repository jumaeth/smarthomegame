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
  const [animating, setAnimating] = useState(false);
  const [showChar, setShowChar] = useState(true);
  const [introRun, setIntroRun] = useState(false);

  //refs
  const charRef = useRef<PixiSprite | null >(null);
  const textRef = useRef<PixiContainer|null>(null);
  const mgrRef = useAnimationManager();
  const graphicRef = useRef<PixiContainer|null>(null);


  const textArr  = useMemo( () => [
    t`The layout`,
    t`Clicking on the phone opens the blueprint of the house. Here you can check where the different rooms are located.`,
    t`The rooms`,
    t`In every room, you’ll find some items – some of them are Smart Devices. Adjust their privacy settings and solve the mini-games to unlock your Smart Home! `,
    t`You are here`,
    t`This is where you start the game. Try not to get lost!`,
    t`The Map`

], [])

  //hide explanations  on init
  useLayoutEffect(() => {
    const text = textRef.current;
    const graphic = graphicRef.current;
    if (!text || !graphic)return;
    toggleExplanations([text, graphic], false);
  }, []);

  const growChar = useMemo<GrowProps>(() =>  {
    return {
    startX: 0.0475 * windowWidth, startY: windowHeight * 0.15,
    endX: windowWidth * 0.5, endY: windowHeight * 0.5,
    startS: Math.min(windowWidth, windowHeight) / 3200, endS: Math.min(windowWidth, windowHeight) / 1000,
    duration: 750
    }
  },[windowWidth, windowHeight])

  const shrinkChar= useMemo<GrowProps>(() =>  {
    return {
    startX: windowWidth * 0.5, startY: windowHeight * 0.5,
    endX: 0.0475 * windowWidth, endY: windowHeight * 0.15,
    startS: Math.min(windowWidth, windowHeight) / 1000, endS: Math.min(windowWidth, windowHeight) / 3200,
    duration: 750
    }
  },[windowWidth, windowHeight])

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
          if (introRun)return
          setAnimating(true);
          await mgr.sequence([() => growAnimation(mgr, sprite, growChar)]);
          toggleExplanations([texts, graphics], true);
          await mgr.parallel([() => fadeAnimation(mgr, [texts, graphics], FADE_IN)]);
          setAnimating(false);
          setIntroRun(true)
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
  }, [animation, Animations.END, Animations.GROW, Animations.SHRINK, mgrRef,
    setKeyControl, setNextPage, growChar, shrinkChar, introRun]);


  useEffect(() => {
    const sprite = charRef.current
    if(!sprite || animating)return;
    sprite.x = growChar.endX
    sprite.y = growChar.endY
    sprite.scale.set(growChar.endS)
  }, [windowWidth, windowHeight, animating, growChar.endS, growChar.endX, growChar.endY]);

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
  const textsData = useMemo<TextProps[]>( ()=> ([
    { text: textArr[0], x: windowWidth*0.05,   y: windowHeight*0.2,  fontSize: 0.035, fontWeight: "bold"   },
    { text: textArr[2], x: windowWidth*0.4, y: windowHeight*0.7,  fontSize: 0.035, fontWeight: "bold"   },
    { text: textArr[4], x: windowWidth*0.7, y: windowHeight*0.2,  fontSize: 0.035, fontWeight: "bold"   },

    { text: textArr[1], x: windowWidth*0.05,   y: windowHeight*0.25,  fontSize: 0.025, fontWeight: "lighter", wrap: 0.25},
    { text: textArr[3], x: windowWidth*0.4, y: windowHeight*0.75,  fontSize: 0.025, fontWeight: "lighter", wrap: 0.25},
    { text: textArr[5], x: windowWidth*0.7,   y: windowHeight*0.25,  fontSize: 0.025, fontWeight: "lighter", wrap: 0.28},

    { text: textArr[6], x: growChar.endX - texture.width * growChar.endS * 0.1, y: windowHeight*0.05, fontSize: 0.07, fontWeight: "bold" },
  ]),[windowWidth, windowHeight, growChar.endS, growChar.endX, textArr, texture.width])

  //define line properties
  const drawLines =  useCallback( (g: PixiGraphics) => {
    g.clear();

    //top left
    g.lineStyle(Math.min(windowWidth, windowHeight) / 120, "#00458f", 1);
    g.moveTo(windowWidth*0.4, windowHeight*0.39);
    g.lineTo(windowWidth*0.3, windowHeight*0.275);

    //top right
    g.lineStyle(Math.min(windowWidth, windowHeight) / 120, "#CC0000", 1);
    g.moveTo(windowWidth*0.489, windowHeight*0.43);
    g.lineTo(windowWidth*0.675, windowHeight*0.25);

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
              {textsData.map((text: TextProps, i) => (
                      <Text
                              key={i}
                              text={text.text}
                              x={text.x}
                              y={text.y}
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