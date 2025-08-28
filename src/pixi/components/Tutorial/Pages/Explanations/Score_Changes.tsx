import React, {KeyboardEvent, PropsWithChildren, useEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics, Sprite, Text} from "@pixi/react";
import pointing from "@/assets/tutorial/finalExpl/pointing.png";
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
import {growAnimation, GrowProps} from "@/pixi/components/Tutorial/anim/growAnimation.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {characterPositionStore} from "@/utils/characterPosition.ts";
import {fadeAnimation, FadeProps} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {useAnimationManager} from "@/hooks/tutorial/useAnimationManager.tsx";


export const Score_Changes: React.FC<PageProps> = ({
       windowWidth,
       windowHeight,
       keyControl,
       setKeyControl,
       setNextPage
           }: PropsWithChildren<PageProps>) => {

  const textureRobot = useMemo(() => loadTexture(pointing), []);
  const robotRef = useRef<PixiSprite | null >(null);
  const [animation, setAnimation] = useState(0);
  const [pixiTexts, setPixiTexts] = useState([]);
  const [onLoad, setOnLoad] = useState(true);
  const [animating, setAnimating] = useState(false);
  const mgrRef = useAnimationManager();
  const fill = "#054388";
  const stroke = "#009CDD";
  const graphicRef = useRef<PixiContainer | null>(null);
  const textRef = useRef<PixiContainer | null>(null);
  const backgroundRef = useRef<PixiContainer | null>(null);



  const textsTemp = [
          "Saw that? Your solution increased the scores. But be careful," +
          " bad decisions decrease them! Make sure you always keep a good balance."
  ]

  //----------init----------

  //init graphics/texts
  useEffect(() => {
    if (onLoad) {
      console.log("loaded")
      //setAnimation(1);
      setOnLoad(false);
    }
  }, [onLoad]);

  useEffect(() => {
    setupBackground();
    setupTexts();
    setupGraphics();
    setupRobot();
    setAnimation(1);
  }, [textRef]);

  //run grow/shrink animation
  const runIntroAnim = async (robot: PixiSprite, growProps: GrowProps, fadeIn: FadeProps) => {
    const mgr = mgrRef.current!;
    const graphic = graphicRef.current;
    const text = textRef.current;
    if (!graphic || !text)return;

    await mgr.parallel([
      () => growAnimation(mgr, robot, growProps),
      () => fadeAnimation(mgr, graphic, fadeIn),
      () => fadeAnimation(mgr, text, fadeIn),
    ]);
  };

  const runOutroAnim = async (robot: PixiSprite, fadeOut: FadeProps) => {
    const mgr = mgrRef.current!;
    const graphic = graphicRef.current;
    const text = textRef.current;
    if (!graphic || !text)return;

    await mgr.parallel([
      () => fadeAnimation(mgr, robot, fadeOut),
      () => fadeAnimation(mgr, graphic, fadeOut),
      () => fadeAnimation(mgr, text, fadeOut),
    ]);
  };

  //manage animations
  useEffect(() => {
    if (!mgrRef.current) return;

    let timeoutId: number | undefined;
    let cancelled = false;
    const robot = robotRef.current;
    if (!robot) return;

    const run = async () => {

      switch (animation) {
        case 1:

          const anim1 = {
            startX:  windowWidth*0.625, startY: windowHeight*0.45,
            endX: windowWidth * 0.625, endY: windowHeight * 0.45,
            startS: 0.4, endS: 0.5, showOthers: false, duration: 750
          } as GrowProps

          const fadeIn = {
            duration: 500,
            startA: 0,
            endA: 1,
          } as FadeProps

          setAnimating(true);
          await runIntroAnim(robot, anim1, fadeIn);
          setAnimating(false);
          setAnimation(0);
          break;
        case 2:
          const fadeOut = {
            duration: 500,
            startA: 1,
            endA: 0,
          } as FadeProps

          setAnimating(true);
          await runOutroAnim(robot, fadeOut);
          setAnimating(false);
          setAnimation(0);
          setKeyControl(Pages.FINAL_MESSAGE);
          break;
      }
    };

    run();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [animation]);

  const teleport = () => {
    characterPositionStore.teleport({x: 10*TILE_SIZE, y: 5*TILE_SIZE})
  };


  //----------user input----------

  //keyControls
  useEffect(() => {
    if(keyControl != Pages.SCORE_CHANGES || animating)return;

    const onSpecialPressed = (e: KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          setAnimation(2);
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
    t1.x = windowWidth*0.8;
    t1.y = windowHeight*0.525;
    t1.style = new TextStyle({
      fontSize: Math.min(windowWidth, windowHeight) * 0.035,
      fontWeight: "normal",
      wordWrapWidth: windowWidth * 0.25
    })

    setPixiTexts(prev => [...prev, t1]);

  }

  const setupBackground = () => {
    const parent = backgroundRef?.current;
    if (!parent) return;

    const b = new PixiGraphics();
    b.clear();
    b.beginFill("#000000", 0.7);
    b.drawRect(0, 0, windowWidth, windowHeight);
    b.beginHole();
    b.drawRoundedRect(windowWidth*0.86, (0.01*windowHeight)-TILE_SIZE*0.25, TILE_SIZE*16.5, TILE_SIZE*7.5, 10);
    b.endHole();
    b.endFill();

    parent.addChild(b);
  }

  const setupGraphics = () => {

    const parent = graphicRef?.current;
    if (!parent) return;

    const g = new PixiGraphics();
    g.clear();
    g.beginFill(fill, 1);
    g.lineStyle(3, stroke);
    g.drawRoundedRect(windowWidth*0.675, windowHeight*0.4, windowWidth*0.25, windowHeight*0.25, 12);
    g.endFill();

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