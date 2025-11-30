import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Container, Graphics, Sprite, Text } from "@pixi/react";
import tvImage from "@/assets/tutorial/explainTVPage/tv.png";
import robot from "@/assets/tutorial/explainTVPage/sad.png";
import { loadTexture } from "@/utils/loadTexture.ts";
import {
  Container as PixiContainer,
  Graphics as PixiGraphics, Rectangle,
  Sprite as PixiSprite,
  Text as PixiText,
  TextStyle
} from "pixi.js";
import { Pages } from "@/pixi/components/Tutorial/Pages/Pages.ts";
import { AnimationManager } from "@/pixi/components/Tutorial/anim/AnimationManager.ts";
import { growAnimation, GrowProps } from "@/pixi/components/Tutorial/anim/growAnimation.ts";
import { PageProps } from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import { fadeAnimation, FadeProps } from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import { PageOrder } from "@/pixi/components/Tutorial/util/PageOrder.ts";
import { t } from "@lingui/core/macro";
import { fill, stroke } from "@/pixi/components/Tutorial/util/TutorialColors.ts";


export const More_Expl: React.FC<PageProps> = ({
  windowWidth,
  windowHeight,
  keyControl,
  setKeyControl,
  setNextPage
}: PropsWithChildren<PageProps>) => {

  const enum Animations { IDLE, INTRO, OUTRO }

  const texture = useMemo(() => loadTexture(tvImage), []);
  const textureRobot = useMemo(() => loadTexture(robot), []);
  const charRef = useRef<PixiSprite | null>(null);
  const robotRef = useRef<PixiSprite | null>(null);
  const [animation, setAnimation] = useState(Animations.IDLE);
  const [pixiText, setPixiText] = useState<PixiText[]>([]);
  const [onLoad, setOnLoad] = useState(true);
  const [animating, setAnimating] = useState(false);
  const mgrRef = useRef<AnimationManager | null>(null);
  const backgroundRef = useRef<PixiGraphics | null>(null);
  const graphicRef = useRef<PixiContainer | null>(null);
  const textRef = useRef<PixiContainer | null>(null);
  const [introRun, setIntroRun] = useState(false);



  const textsTemp = useMemo(() => [
    t`Oh no, look at your Smart TV! It has been taken over by the hacker and is only displaying blurry red noise...\n\nLet’s put what we’ve learned into practice! Move the avatar towards the Smart TV, adjust the settings and regain control of your Smart Home.`
  ], [])

  //----------init----------

  //init graphics/texts
  useEffect(() => {
    if (onLoad) {
      setAnimation(Animations.INTRO);
      setOnLoad(false);
    }
  }, [onLoad, Animations.INTRO]);

  //----------animations----------

  //cleanup animations
  useEffect(() => {
    mgrRef.current = new AnimationManager();
    return () => mgrRef.current?.cancelAll();
  }, []);

  //run grow/shrink animation
  const runIntroAnim = async (sprite: PixiSprite, robot: PixiSprite, growProps: GrowProps, fadeIn: FadeProps) => {
    const mgr = mgrRef.current!;
    const graphic = graphicRef.current;
    const text = textRef.current;
    if (!graphic || !text) return;

    await mgr.parallel([
      () => growAnimation(mgr, sprite, growProps),
      () => fadeAnimation(mgr, [robot, graphic, text], fadeIn),
    ]);
  };

  const runOutroAnim = async (sprite: PixiSprite, robot: PixiSprite, fadeOut: FadeProps) => {
    const mgr = mgrRef.current!;
    const graphic = graphicRef.current;
    const text = textRef.current;
    if (!graphic || !text) return;

    await mgr.parallel([
      () => fadeAnimation(mgr, [sprite, robot, graphic, text], fadeOut),
    ]);
  };

  const anim1 = useMemo<GrowProps>(() => ({
    startX: windowWidth * 0.2425,
    startY: windowHeight * 0.0925,
    endX: windowWidth * 0.2,
    endY: windowHeight * 0.3,
    startS: Math.min(windowWidth, windowHeight) / 1000,
    endS: Math.min(windowWidth, windowHeight) / 450,
    duration: 750,
  }), [windowWidth, windowHeight]);

  const fadeIn = useMemo<FadeProps>(() => {
    return {
      duration: 500,
      startA: 0,
      endA: 1,
    }
  }, [])

  //manage animations
  useEffect(() => {
    if (!mgrRef.current) return;

    let timeoutId: number | undefined;
    const sprite = charRef.current;
    const robot = robotRef.current;
    if (!sprite || !robot) return;

    const run = async () => {

      switch (animation) {
        case Animations.INTRO: {
          if (introRun) return
          setAnimating(true);
          await runIntroAnim(sprite, robot, anim1, fadeIn);
          setAnimating(false);
          setAnimation(Animations.IDLE);
          setIntroRun(true)
          break;
        }

        case Animations.OUTRO: {

          const fadeOut = {
            duration: 500,
            startA: 1,
            endA: 0,
          } as FadeProps

          setAnimating(true);
          await runOutroAnim(sprite, robot, fadeOut);
          setAnimating(false);
          setAnimation(Animations.IDLE);
          setKeyControl(Pages.MAIN);
          setNextPage(PageOrder.More_Expl_SD);
          break;
        }
      }
    };

    run();

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [animation, Animations.INTRO, Animations.IDLE,
    Animations.OUTRO, setKeyControl, setNextPage, introRun, anim1, fadeIn]);


  //----------user input----------

  const continueTutorial = useCallback(() => {
    if (animating) return
    setAnimation(Animations.OUTRO)
  }, [Animations.OUTRO, animating])

  //keyControls
  useEffect(() => {
    if (keyControl != Pages.MORE_EXPL || animating) return;

    const onSpecialPressed = (e: globalThis.KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          continueTutorial()
          break;
      }
    }

    const events = [onSpecialPressed];

    events.forEach(func => window.addEventListener("keydown", func));
    return () => {
      events.forEach(func => window.removeEventListener("keydown", func));
    };
  }, [keyControl, animating, Animations.OUTRO, continueTutorial]);



  //----------drawings----------

  //store line properties in pixiGraphic
  const setupTexts = useCallback(() => {
    const t1 = new PixiText();
    t1.text = textsTemp[0];
    t1.x = windowWidth * 0.55;
    t1.y = windowHeight * 0.45;
    t1.style = new TextStyle({
      fontSize: Math.min(windowWidth, windowHeight) * 0.035,
      fontWeight: "normal",
      wordWrapWidth: windowWidth * 0.4
    })

    const parent = graphicRef?.current;
    if (!parent) return;
    parent.children.filter(c => c instanceof PixiText).forEach(text => parent.removeChild(text))


    setPixiText([t1]);

  }, [textsTemp, windowWidth, windowHeight])

  const setupGraphics = useCallback(() => {


    const g = new PixiGraphics();
    g.clear();
    g.beginFill(fill, 1);
    g.lineStyle(3, stroke);
    g.drawRoundedRect(windowWidth * 0.34, windowHeight * 0.295, windowWidth * 0.42, windowHeight * 0.32, 12);
    g.endFill();

    const parent = graphicRef?.current;
    if (!parent) return;
    parent.children.filter(c => c instanceof PixiGraphics).forEach(graphic => parent.removeChild(graphic))

    parent.addChild(g);
  }, [windowWidth, windowHeight])

  const setupRobot = useCallback(() => {

    const r = robotRef.current;
    if (!r) return;

    r.anchor.set(0.5, 0.5);
    r.x = windowWidth * 0.825;
    r.y = windowHeight * 0.7;
    r.scale.set(Math.min(windowWidth, windowHeight) / 700)
    r.texture = textureRobot;

  }, [textureRobot, windowWidth, windowHeight])

  const setupTVSprite = useCallback(() => {
    const ref = charRef.current;
    if (!ref) return;
    ref.x = windowWidth * 0.2
    ref.y = windowHeight * 0.25
    ref.anchor.set(0.5, 0.5)
    ref.scale.set(anim1.endS)
  }, [windowWidth, windowHeight, anim1.endS]);

  useEffect(() => {
    setupTexts();
    setupGraphics();
    setupRobot();
    setupTVSprite();
  }, [textRef, setupGraphics, setupRobot, setupTexts, setupTVSprite]);

  const graphics = () => {
    return (
      <Container>
        {<Container ref={graphicRef} />}
      </Container>
    )
  }


  const background = () => {
    return (
      <>
        <Graphics ref={backgroundRef} />
      </>
    )
  }

  //translate texts to react
  const texts = () => {
    return (
      <Container ref={textRef}>
        {pixiText.map((msg, i) => (
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
      <Container
        eventMode="static"
        hitArea={new Rectangle(0, 0, windowWidth, windowHeight)}
        pointertap={continueTutorial}
      >
        {texture && <Sprite
          texture={texture}
          ref={charRef}
        />}
        {background()}
        {graphics()}
        {texts()}
        {textureRobot && <Sprite
          texture={textureRobot}
          ref={robotRef}
        />}
      </Container>
    </>
  )
};