import React, {PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Container, Sprite, Text} from "@pixi/react";
import waving from "@/assets/tutorial/finalExpl/waving.png";
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
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {fadeAnimation, FadeProps} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {PageOrder} from "@/pixi/components/Tutorial/util/PageOrder.ts";
import {FADE_IN, FADE_OUT} from "@/pixi/components/Tutorial/util/AnimProps.ts";
import {t} from "@lingui/core/macro";


export const Final_Message: React.FC<PageProps> = ({
       windowWidth,
       windowHeight,
       keyControl,
       setKeyControl,
       setNextPage
           }: PropsWithChildren<PageProps>) => {

  const enum Animations {IDLE, INTRO, OUTRO}

  const textureRobot = useMemo(() => loadTexture(waving), []);
  const robotRef = useRef<PixiSprite | null >(null);
  const [animation, setAnimation] = useState(Animations.IDLE);
  const [pixiTexts, setPixiTexts] = useState<PixiText[]>([]);
  const [animating, setAnimating] = useState(false);
  const mgrRef = useRef<AnimationManager | null>(null);
  const fill = "#054388";
  const stroke = "#009CDD";
  const graphicRef = useRef<PixiContainer | null>(null);
  const textRef = useRef<PixiContainer | null>(null);
  const backgroundRef = useRef<PixiContainer | null>(null);



  const textsTemp = useMemo( () => [
    t`That's it, now you are ready to save the smart home and make that movie night possible!`
  ], [])


  //----------animations----------

  //cleanup animations
  useEffect(() => {
    mgrRef.current = new AnimationManager();
    return () => mgrRef.current?.cancelAll();
  }, []);

  //run grow/shrink animation
  const runIntroAnim = async (robot: PixiSprite, fadeIn: FadeProps) => {
    const mgr = mgrRef.current!;
    const graphic = graphicRef.current;
    const text = textRef.current;
    if (!graphic || !text)return;

    await mgr.parallel([
      () => fadeAnimation(mgr, [robot, graphic, text], fadeIn),
    ]);
  };

  const runOutroAnim = async (robot: PixiSprite, fadeOut: FadeProps) => {
    const mgr = mgrRef.current!;
    const graphic = graphicRef.current;
    const bg = backgroundRef.current;
    const text = textRef.current;
    if (!graphic || !text || !bg)return;

    await mgr.parallel([
      () => fadeAnimation(mgr, [bg, robot, graphic, text], fadeOut),
    ]);
  };

  //manage animations
  useEffect(() => {
    if (!mgrRef.current) return;

    let timeoutId: number | undefined;
    const robot = robotRef.current;
    if (!robot) return;

    const run = async () => {

      switch (animation) {
        case Animations.INTRO: {

          setAnimating(true);
          await runIntroAnim(robot, FADE_IN);
          setAnimating(false);
          setAnimation(Animations.IDLE);
          break;
        }
        case Animations.OUTRO: {

          setAnimating(true);
          await runOutroAnim(robot, FADE_OUT);
          setAnimating(false);
          setAnimation(Animations.IDLE);
          setKeyControl(Pages.MAIN);
          setNextPage(PageOrder.END);
          break;
        }
      }
    };

    run();

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [animation, Animations.IDLE, Animations.INTRO, Animations.OUTRO, setKeyControl, setNextPage]);


  //----------user input----------

  //keyControls
  useEffect(() => {
    if(keyControl != Pages.FINAL_MESSAGE || animating)return;

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
  }, [keyControl, animating, Animations.OUTRO]);



  //----------drawings----------

  //store line properties in pixiGraphic
  const setupTexts = useCallback(() => {
    const t1 = new PixiText();
    t1.text = textsTemp[0];
    t1.x = windowWidth*0.5;
    t1.y = windowHeight*0.575;
    t1.style = new TextStyle({
      fontSize: Math.min(windowWidth, windowHeight) * 0.035,
      fontWeight: "normal",
      wordWrapWidth: windowWidth * 0.295
    })

    setPixiTexts(prev => [...prev, t1]);

  },[textsTemp, windowWidth, windowHeight])

  const setupBackground = useCallback(() => {
    const parent = backgroundRef?.current;
    if (!parent) return;

    const b = new PixiGraphics();
    b.clear();
    b.beginFill("#000000", 0.7);
    b.drawRect(0, 0, windowWidth, windowHeight);
    b.endFill();

    parent.addChild(b);
  },[windowWidth, windowHeight])

  const setupGraphics = useCallback( () => {

    const parent = graphicRef?.current;
    if (!parent) return;

    const g = new PixiGraphics();
    g.clear();
    g.beginFill(fill, 1);
    g.lineStyle(3, stroke);
    g.drawRoundedRect(windowWidth*0.35, windowHeight*0.5, windowWidth*0.3, windowHeight*0.15, 12);
    g.endFill();

    parent.addChild(g);
  },[windowWidth, windowHeight])

  const setupRobot = useCallback( () => {

    const r = robotRef.current;
    if (!r)return;

    r.anchor.set(0.5, 0.5);
    r.x = windowWidth * 0.5;
    r.y = windowHeight * 0.3;
    r.scale.set(0.75);
    r.texture = textureRobot;

  },[textureRobot, windowWidth, windowHeight])

  useEffect(() => {
    setupBackground();
    setupTexts();
    setupGraphics();
    setupRobot();
    setAnimation(Animations.INTRO);
  }, [textRef, Animations.INTRO, setupTexts, setupGraphics, setupRobot, setupBackground]);

  const graphics = () => {
    return (
            <Container>
              {<Container ref={graphicRef}/>}
            </Container>
    )
  }

  const background = () => {
    return (
            <Container>
              <Container ref={backgroundRef} />
            </Container>
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
        {background()}
        {textureRobot && <Sprite
          texture={textureRobot}
          ref={robotRef}
        />}
        {graphics()}
        {texts()}
      </>
  )
};