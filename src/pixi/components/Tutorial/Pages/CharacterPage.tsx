import React, {PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics, Sprite, Text} from "@pixi/react";
import characterImage from "@/assets/tutorial/characterPage/cp_character.png";
import arrowKeys from "@/assets/tutorial/characterPage/cp_arrow_keys.png";
import eKey from "@/assets/tutorial/characterPage/cp_e_key.png";
import highlighting from "@/assets/tutorial/characterPage/cp_highlight.png";
import {loadTexture} from "@/utils/loadTexture.ts";
import {Container as PixiContainer, Graphics as PixiGraphics, Sprite as PixiSprite, TextStyle} from "pixi.js";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {ImageProps, TextProps} from "@/pixi/components/Tutorial/util/Types.ts";
import {fadeAnimation} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {useAnimationManager} from "@/hooks/tutorial/useAnimationManager.tsx";
import {growAnimation, GrowProps} from "@/pixi/components/Tutorial/anim/growAnimation.ts";
import {toggleExplanations} from "@/pixi/components/Tutorial/util/drawings.tsx";
import {PageOrder} from "@/pixi/components/Tutorial/util/PageOrder.ts";
import {GROW_DURATION} from "@/pixi/components/Tutorial/util/Constants.ts";
import {t} from "@lingui/core/macro";
import {FADE_IN, FADE_OUT} from "@/pixi/components/Tutorial/util/AnimProps.ts";

export const CharacterPage: React.FC<PageProps> = ({
       windowWidth,
       windowHeight,
       keyControl,
       setKeyControl,
       setNextPage
           }: PropsWithChildren<PageProps>) => {

  const enum Animations {GROW, SHRINK, END}

  //states
  const [animating, setAnimating] = useState(false);
  const [showChar, setShowChar] = useState(true);
  const [animation, setAnimation] = useState(Animations.GROW);

  //refs
  const textRef = useRef<PixiContainer|null>(null);
  const imageRef = useRef<PixiContainer|null>(null);
  const charRef = useRef<PixiSprite | null >(null);
  const graphicRef = useRef<PixiContainer|null>(null);
  const pressedRef = useRef<boolean>(false);
  const [introRun, setIntroRun] = useState(false);

  //others
  const textsTemp = useMemo(() => [
          t`Movement`, t`Use the arrow keys or WASD to move around`, t`Interaction`, t`Use the “E” key to interact with objects`,
          t`Discovery`, t`Interactive objects light up if you walk next to them`, t`The Player`
  ], [])
  const texture = useMemo(() => loadTexture(characterImage), []);
  const imageSource: typeof arrowKeys[] = useMemo(() => [arrowKeys, eKey, highlighting], []);

  //hooks
  const mgrRef = useAnimationManager();

  const textsData = useMemo<TextProps[]>(() => ([
    { text: textsTemp[0], x: windowWidth*0.2,   y: windowHeight*0.29,  fontSize: 0.04, fontWeight: "bold"   },
    { text: textsTemp[2], x: windowWidth*0.225, y: windowHeight*0.79,  fontSize: 0.04, fontWeight: "bold"   },
    { text: textsTemp[4], x: windowWidth*0.8,   y: windowHeight*0.525,  fontSize: 0.04, fontWeight: "bold"   },
    { text: textsTemp[1], x: windowWidth*0.2,   y: windowHeight*0.35,  fontSize: 0.03, fontWeight: "lighter"},
    { text: textsTemp[3], x: windowWidth*0.225, y: windowHeight*0.85,  fontSize: 0.03, fontWeight: "lighter"},
    { text: textsTemp[5], x: windowWidth*0.8,   y: windowHeight*0.6, fontSize: 0.03, fontWeight: "lighter"},
    { text: textsTemp[6], x: windowWidth*0.525, y: windowHeight*0.25, fontSize: 0.07, fontWeight: "bold" },
  ]), [textsTemp, windowWidth, windowHeight]);


  const imagesData = useMemo<ImageProps[]>(() => ([
    { texture: loadTexture(imageSource[0]), x: windowWidth*0.2,   y: windowHeight*0.18,  scale: 8   },
    { texture: loadTexture(imageSource[1]), x: windowWidth*0.225, y: windowHeight*0.7,   scale: 6.5 },
    { texture: loadTexture(imageSource[2]), x: windowWidth*0.8,   y: windowHeight*0.29,  scale: 6.5 },
  ]), [imageSource, windowWidth, windowHeight]);

  //hide explanations  on init
  useLayoutEffect(() => {
    const text = textRef.current;
    const graphic = graphicRef.current;
    const image = imageRef.current;
    if (!text || !graphic || !image)return;
    toggleExplanations([text, image, graphic], false);
  }, []);

  //keyControls
  useEffect(() => {
    if(keyControl != Pages.CHARACTER || animating)return;

    const onSpecialPressed = (e: globalThis.KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          pressedRef.current = true;
          setAnimation(Animations.SHRINK);
      }
    }

    const events = [onSpecialPressed];

    events.forEach(func => window.addEventListener("keydown", func));
    return () => {
      events.forEach(func => window.removeEventListener("keydown", func));
    };
  }, [keyControl, animating, Animations.SHRINK]);

  const growChar= useMemo<GrowProps>(() =>  {
    return {
    startX: windowWidth / 1.75, startY: windowHeight / 1.5,
    endX: windowWidth * 0.525, endY: windowHeight * 0.525,
    startS: Math.min(windowWidth, windowHeight) / 100, endS: Math.min(windowWidth, windowHeight) / 45,
    duration: GROW_DURATION
    }
  }, [windowWidth, windowHeight])

  const shrinkChar= useMemo<GrowProps>(() =>  {
    return {
    startX: windowWidth * 0.525, startY: windowHeight * 0.525,
    endX: windowWidth / 1.75, endY: windowHeight / 1.5,
    startS: Math.min(windowWidth, windowHeight) / 45, endS: Math.min(windowWidth, windowHeight) / 100,
    duration: GROW_DURATION
    }
  }, [windowWidth, windowHeight])

  //manage animations
  useEffect(() => {
    let timeoutId: number | undefined;

    const mgr = mgrRef.current!;
    const sprite = charRef.current;
    const texts = textRef.current;
    const images = imageRef.current;
    const graphics = graphicRef.current;
    if (!sprite || !mgr || !texts || !images || !graphics) return;

    const run = async () => {
      switch (animation) {

        case Animations.GROW: {
          if (introRun)return
          setAnimating(true);
          await mgr.sequence([() => growAnimation(mgr, sprite, growChar)]);
          toggleExplanations([texts, images, graphics], true);
          await mgr.parallel([() => fadeAnimation(mgr, [texts, images, graphics], FADE_IN)]);
          setAnimating(false);
          setIntroRun(true)
          break;
        }

        case Animations.SHRINK: {
          setAnimating(true);
          await mgr.parallel([
            () => fadeAnimation(mgr, [texts, images, graphics], FADE_OUT),
            () => growAnimation(mgr, sprite, shrinkChar)])
          setAnimating(false);
          toggleExplanations([texts, images, graphics], false);
          setAnimation(Animations.END)
          break;
        }

        case Animations.END:
          setKeyControl(Pages.MAIN);
          setNextPage(PageOrder.SCORES);
          setAnimating(true);
          setShowChar(false);
          break;

      }
    }

    run();
    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [animation, Animations.END, Animations.GROW, Animations.SHRINK, mgrRef,
    setKeyControl, setNextPage, introRun, growChar, shrinkChar]);

  useEffect(() => {
    const sprite = charRef.current
    if(!sprite || animating)return;
    sprite.x = growChar.endX
    sprite.y = growChar.endY
    sprite.scale.set(growChar.endS)
  }, [windowWidth, windowHeight, animating, growChar.endS, growChar.endX, growChar.endY]);

  //setup graphics
  const setupLines =  useCallback( (g: PixiGraphics) => {
    g.clear();

    const img = {
      width: texture.width <= 1 ? 24 * growChar.endS: texture.width * growChar.endS,
      height: texture.height <= 1 ? 25 * growChar.endS : texture.height * growChar.endS
    };

    //top left
    g.lineStyle(Math.min(windowWidth, windowHeight) / 120, "FFFFFF", 1);
    g.moveTo(textsData[3].x + windowWidth * 0.11, textsData[3].y - windowHeight * 0.03)
    g.bezierCurveTo(
            growChar.endX - img.width * 0.6, growChar.endY - img.height * 0.4,
            growChar.endX - img.width * 0.6,growChar.endY - img.height * 0.135,
            growChar.endX - img.width * 0.315, growChar.endY - img.height * 0.135
            )

    //bottom
    g.lineStyle(Math.min(windowWidth, windowHeight) / 120, "FFFFFF", 1);
    g.moveTo(textsData[4].x + windowWidth * 0.09,textsData[4].y - windowHeight * 0.075)
    g.bezierCurveTo(growChar.endX - img.width * 0.7675,growChar.endY + img.height * 0.3,
            growChar.endX - img.width * 0.374,growChar.endY + img.height * 0.35,
            growChar.endX - img.width * 0.325,growChar.endY + img.height * 0.261
    )

    //top right
    g.lineStyle(Math.min(windowWidth, windowHeight) / 120, "FFFFFF", 1);
    g.moveTo(textsData[5].x - windowWidth * 0.075, textsData[5].y - windowWidth * 0.035);
    g.bezierCurveTo(
            growChar.endX + img.width * 0.4715, growChar.endY - img.height * 0.2,
            growChar.endX + img.width * 0.437, growChar.endY + img.height * 0.045,
            growChar.endX + img.width * 0.3, growChar.endY - img.height * 0.045);
  }, [windowWidth, windowHeight, growChar.endS, growChar.endX, growChar.endY, textsData, texture.height, texture.width])

  const lines = () => {
    return (
            <Container ref={graphicRef}>
              <Graphics draw={setupLines}/>
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
                              anchor={0.5}
                              style={new TextStyle({
                                fontFamily: "LoResRegular",
                                fontSize: Math.min(windowWidth, windowHeight)*text.fontSize,
                                fontWeight: text.fontWeight,
                                fill: "#FFFFFF",
                                align: "center",
                                wordWrap: true,
                                wordWrapWidth: windowWidth * 0.2,
                              })
                              }
                      />
              ))}
            </Container>
    )
  }

  const images = () => {
    return (
            <Container ref={imageRef}>
              {imagesData.map((i, k) => (
                <Sprite
                        key={k}
                        texture={i.texture}
                        x={i.x}
                        y={i.y}
                        anchor={0.5}
                        scale={Math.min(windowWidth, windowHeight) / (100 * i.scale)}
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
          x={charRef.current?.x as number}
        />}
        {lines()}
        {texts()}
        {images()}
      </>
  )
};