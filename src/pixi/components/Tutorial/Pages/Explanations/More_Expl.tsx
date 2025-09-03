import React, {PropsWithChildren, useEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics, Sprite, Text} from "@pixi/react";
import tvImage from "@/assets/tutorial/explainTVPage/tv.png";
import robot from "@/assets/tutorial/explainTVPage/sad.png";
import {loadTexture} from "@/utils/loadTexture.ts";
import {
  Container as PixiContainer,
  Graphics as PixiGraphics,
  Sprite as PixiSprite,
  Text as PixiText,
  TextStyle
} from "pixi.js";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {AnimationManager} from "@/pixi/components/Tutorial/anim/AnimationManager.ts";
import {growAnimation, GrowProps} from "@/pixi/components/Tutorial/anim/growAnimation.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {fadeAnimation, FadeProps} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {PageOrder} from "@/pixi/components/Tutorial/Tutorial.tsx";
import {t} from "@lingui/core/macro";


export const More_Expl: React.FC<PageProps> = ({
       windowWidth,
       windowHeight,
       keyControl,
       setKeyControl,
       setNextPage
           }: PropsWithChildren<PageProps>) => {

  const enum Animations {IDLE, INTRO, OUTRO}

  const texture = useMemo(() => loadTexture(tvImage), []);
  const textureRobot = useMemo(() => loadTexture(robot), []);
  const charRef = useRef<PixiSprite | null >(null);
  const robotRef = useRef<PixiSprite | null >(null);
  const [animation, setAnimation] = useState(Animations.IDLE);
  const [pixiTexts, setPixiTexts] = useState<PixiText[]>([]);
  const [onLoad, setOnLoad] = useState(true);
  const [animating, setAnimating] = useState(false);
  const mgrRef = useRef<AnimationManager | null>(null);
  const backgroundRef = useRef<PixiGraphics | null>(null);
  const fill = "#054388";
  const stroke = "#009CDD";
  const graphicRef = useRef<PixiContainer | null>(null);
  const textRef = useRef<PixiContainer | null>(null);



  const textsTemp = [
    t`Oh no! See the smartTV? It is controlled by the attacker and shows only red images.\n\nLet’s use the learned to navigate to the smart device and solve the challenge to regain control.`
  ]

  //----------init----------

  //init graphics/texts
  useEffect(() => {
    if (onLoad) {
      setAnimation(Animations.INTRO);
      setOnLoad(false);
    }
  }, [onLoad]);

  useEffect(() => {
    setupTexts();
    setupGraphics();
    setupRobot();
  }, [textRef]);


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
    if (!graphic || !text)return;

    await mgr.parallel([
      () => growAnimation(mgr, sprite, growProps),
      () => fadeAnimation(mgr, [robot, graphic, text], fadeIn),
    ]);
  };

  const runOutroAnim = async (sprite: PixiSprite, robot: PixiSprite, fadeOut: FadeProps) => {
    const mgr = mgrRef.current!;
    const graphic = graphicRef.current;
    const text = textRef.current;
    if (!graphic || !text)return;

    await mgr.parallel([
      () => fadeAnimation(mgr, [sprite, robot, graphic, text], fadeOut),
    ]);
  };

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

          const anim1 = {
            startX: windowWidth * 0.2425, startY: windowHeight * 0.0925,
            endX: windowWidth * 0.2, endY: windowHeight * 0.3,
            startS: 1, endS: 2, showOthers: false, duration: 750
          } as GrowProps

          const fadeIn = {
            duration: 500,
            startA: 0,
            endA: 1,
          } as FadeProps

          setAnimating(true);
          await runIntroAnim(sprite, robot, anim1, fadeIn);
          setAnimating(false);
          setAnimation(Animations.IDLE);
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
  }, [animation]);


  //----------user input----------

  //keyControls
  useEffect(() => {
    if(keyControl != Pages.MORE_EXPL || animating)return;

    const onSpecialPressed = (e: globalThis.KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          setAnimation(Animations.OUTRO);
          break;
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
  const setupTexts = () => {
    const t1 = new PixiText();
    t1.text = textsTemp[0];
    t1.x = windowWidth*0.575;
    t1.y = windowHeight*0.45;
    t1.style = new TextStyle({
      fontSize: Math.min(windowWidth, windowHeight) * 0.035,
      fontWeight: "normal",
      wordWrapWidth: windowWidth * 0.4
    })

    setPixiTexts(prev => [...prev, t1]);

  }
  const setupGraphics = () => {

    const g = new PixiGraphics();
    g.clear();
    g.beginFill(fill, 1);
    g.lineStyle(3, stroke);
    g.drawRoundedRect(windowWidth*0.365, windowHeight*0.295, windowWidth*0.42, windowHeight*0.32, 12);
    g.endFill();

    const parent = graphicRef?.current;
    if (!parent) return;

    parent.addChild(g);
  }

  const setupRobot = () => {

    const r = robotRef.current;
    if (!r)return;

    r.anchor.set(0.5, 0.5);
    r.x = windowWidth * 0.775;
    r.y = windowHeight * 0.7;
    r.texture = textureRobot;

  }

  const graphics = () => {
    return (
            <Container>
              {<Container ref={graphicRef}/>}
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
      </>
  )
};