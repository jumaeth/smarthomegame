import React, { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Container, Graphics, Sprite, Text } from "@pixi/react";
import scoresImage from "@/assets/tutorial/scoresPage/scores.png";
import { loadTexture } from "@/utils/loadTexture.ts";
import {
  Container as PixiContainer,
  Graphics as PixiGraphics,
  Rectangle,
  Sprite as PixiSprite,
  TextStyle
} from "pixi.js";
import { Pages } from "@/pixi/components/Tutorial/Pages/Pages.ts";
import { growAnimation, GrowProps } from "@/pixi/components/Tutorial/anim/growAnimation.ts";
import { PageProps } from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import { TextProps } from "@/pixi/components/Tutorial/util/Types.ts";
import { GROW_DURATION } from "@/pixi/components/Tutorial/util/Constants.ts";
import { toggleExplanations } from "@/pixi/components/Tutorial/util/drawings.tsx";
import { fadeAnimation } from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import { FADE_IN, FADE_OUT } from "@/pixi/components/Tutorial/util/AnimProps.ts";
import { PageOrder } from "@/pixi/components/Tutorial/util/PageOrder.ts";
import { useAnimationManager } from "@/hooks/tutorial/useAnimationManager.tsx";
import { t } from "@lingui/core/macro";


export const ScoresPage: React.FC<PageProps> = ({
  windowWidth,
  windowHeight,
  keyControl,
  setKeyControl,
  setNextPage
}: PropsWithChildren<PageProps>) => {

  const enum Animations { GROW, SHRINK, END }

  //memo
  const texture = useMemo(() => loadTexture(scoresImage), []);

  //state
  const [animating, setAnimating] = useState(false);
  const [showChar, setShowChar] = useState(true);
  const [animation, setAnimation] = useState(Animations.GROW);
  const [introRun, setIntroRun] = useState(false);

  //refs
  const graphicRef = useRef<PixiContainer | null>(null);
  const mgrRef = useAnimationManager();
  const textRef = useRef<PixiContainer | null>(null);
  const charRef = useRef<PixiSprite | null>(null);


  //others
  const textArr = useMemo(() => [
    t`Your privacy score`,
    t`This indicates the safety of your data. Malicious attackers might try to steal your data and use it against you. A high privacy score makes data breaches less likely.`,
    t`Your comfort score`,
    t`Your Smart Home does a great deal to make your life more comfortable. It can automate routines or anticipate your preferences. A high comfort score makes things easier for you.`,
    t`The scores`
  ], [])

  //hide explanations  on init
  useLayoutEffect(() => {
    if (!textRef.current || !graphicRef.current) return;
    toggleExplanations([textRef.current, graphicRef.current], false);
  }, []);

  const growChar = useMemo<GrowProps>(() => {
    return {
      startX: 0.9275 * windowWidth, startY: windowHeight * 0.08,
      endX: windowWidth * 0.55, endY: windowHeight * 0.3,
      startS: Math.min(windowWidth, windowHeight) / 3600, endS: Math.min(windowWidth, windowHeight) / 1000,
      duration: GROW_DURATION
    };
  }, [windowWidth, windowHeight]);

  const shrinkChar = useMemo<GrowProps>(() => {
    return {
      startX: windowWidth * 0.55, startY: windowHeight * 0.3,
      endX: 0.9275 * windowWidth, endY: windowHeight * 0.063,
      startS: Math.min(windowWidth, windowHeight) / 1000, endS: Math.min(windowWidth, windowHeight) / 3600,
      duration: GROW_DURATION
    };
  }, [windowWidth, windowHeight])

  //manage animations
  useEffect(() => {
    let timeoutId: number | undefined;

    const mgr = mgrRef.current!;
    const sprite = charRef.current;
    const texts = textRef.current;
    const graphics = graphicRef.current;
    if (!sprite || !mgr || !texts || !graphics) return;

    const run = async () => {
      switch (animation) {

        case Animations.GROW: {
          if (introRun) return
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
  }, [animation, Animations.END, Animations.GROW, Animations.SHRINK, mgrRef,
    setKeyControl, setNextPage, growChar, shrinkChar, introRun]);

  useEffect(() => {
    const sprite = charRef.current;
    if (!sprite || animating) return;

    if (!introRun) {
      sprite.x = growChar.startX;
      sprite.y = growChar.startY;
      sprite.scale.set(growChar.startS);
    } else {
      sprite.x = growChar.endX;
      sprite.y = growChar.endY;
      sprite.scale.set(growChar.endS);
    }
  }, [windowWidth, windowHeight, animating, growChar, introRun]);

  const continueTutorial = useCallback(() => {
    if (animating) return
    setAnimation(Animations.SHRINK);
  }, [Animations.SHRINK, animating])

  //keyControls
  useEffect(() => {
    if (keyControl != Pages.SCORES || animating) return;

    const onSpecialPressed = (e: globalThis.KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          continueTutorial()
      }
    }

    const events = [onSpecialPressed];

    events.forEach(func => window.addEventListener("keydown", func));
    return () => {
      events.forEach(func => window.removeEventListener("keydown", func));
    };
  }, [keyControl, animating, Animations.SHRINK, continueTutorial]);


  //setup graphics
  const textsData = useMemo<TextProps[]>(() => [
    { text: textArr[0], x: windowWidth * 0.1, y: windowHeight * 0.6, fontSize: 0.04, fontWeight: "bold" },
    { text: textArr[2], x: windowWidth * 0.575, y: windowHeight * 0.625, fontSize: 0.04, fontWeight: "bold" },
    { text: textArr[1], x: windowWidth * 0.1025, y: windowHeight * 0.65, fontSize: 0.03, fontWeight: "lighter" },
    { text: textArr[3], x: windowWidth * 0.5775, y: windowHeight * 0.675, fontSize: 0.03, fontWeight: "lighter", wrap: 0.36 },
    { text: textArr[4], x: windowWidth * 0.5, y: windowHeight * 0.05, fontSize: 0.07, fontWeight: "bold" },
  ], [windowWidth, windowHeight, textArr]);

  const drawLines = useCallback((g: PixiGraphics) => {
    g.clear();

    const img = {
      width: texture.width <= 1 ? 868 * growChar.endS : texture.width * growChar.endS,
      height: texture.height <= 1 ? 374 * growChar.endS : texture.height * growChar.endS
    };

    //left
    g.lineStyle(Math.min(windowWidth, windowHeight) / 90, "#f0b100", 1);
    g.moveTo(textsData[0].x + windowWidth * 0.05, textsData[0].y - windowHeight * 0.05);
    g.bezierCurveTo(
      growChar.endX - img.width * 0.85, growChar.endY + img.height * 0.2,
      growChar.endX - img.width * 0.65, growChar.endY - img.height * 0.2,
      growChar.endX - img.width * 0.55, growChar.endY - img.height * 0.25
    )

    //right
    g.lineStyle(Math.min(windowWidth, windowHeight) / 90, "#f0b100", 1);
    g.moveTo(textsData[1].x - windowWidth * 0.025, textsData[1].y + windowHeight * 0.1);
    g.bezierCurveTo(
      growChar.endX - img.width * 0.1, growChar.endY + img.height * 1.1,
      growChar.endX - img.width * 0.25, growChar.endY + img.height * 0.9,
      growChar.endX - img.width * 0.325, growChar.endY + img.height * 0.6
    )

  }, [windowWidth, windowHeight, growChar.endS, growChar.endX, growChar.endY, textsData, texture.height, texture.width])

  const lines = () => {
    return (
      <Container ref={graphicRef}>
        <Graphics draw={drawLines} />
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
      <Container
        eventMode="static"
        hitArea={new Rectangle(0, 0, windowWidth, windowHeight)}
        pointertap={continueTutorial}
      >
        {showChar && texture && <Sprite
          texture={texture}
          ref={charRef}
        />}
        {lines()}
        {texts()}
      </Container>
    </>
  )
};