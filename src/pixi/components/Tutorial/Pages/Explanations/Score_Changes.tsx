import React, {PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,} from "react";
import {Container, Sprite, Text} from "@pixi/react";
import pointing from "@/assets/tutorial/finalExpl/pointing.png";
import {loadTexture} from "@/utils/loadTexture.ts";
import {
  Container as PixiContainer,
  Graphics as PixiGraphics,
  Sprite as PixiSprite,
  Text as PixiText,
  TextStyle,
} from "pixi.js";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {growAnimation, GrowProps} from "@/pixi/components/Tutorial/anim/growAnimation.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {fadeAnimation, FadeProps} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {useAnimationManager} from "@/hooks/tutorial/useAnimationManager.tsx";
import {t} from "@lingui/core/macro";
import {fill, stroke} from "@/pixi/components/Tutorial/util/TutorialColors.ts";

export const Score_Changes: React.FC<PageProps> = ({
                                                     windowWidth,
                                                     windowHeight,
                                                     keyControl,
                                                     setKeyControl,
                                                     gameService,
                                                   }: PropsWithChildren<PageProps>) => {
  const enum Animations {
    IDLE,
    INTRO,
    OUTRO,
  }

  const textureRobot = useMemo(() => loadTexture(pointing), []);
  const robotRef = useRef<PixiSprite | null>(null);

  const [animation, setAnimation] = useState(Animations.INTRO);
  const [pixiTexts, setPixiTexts] = useState<PixiText[]>([]);
  const [animating, setAnimating] = useState(false);
  const [introRun, setIntroRun] = useState(false);


  const mgrRef = useAnimationManager();

  const graphicRef = useRef<PixiContainer | null>(null);
  const textRef = useRef<PixiContainer | null>(null);
  const backgroundRef = useRef<PixiContainer | null>(null);

  const initedRef = useRef(false);

  const textsTemp = useMemo(
          () => [
            t`Saw that? Your solution increased the scores. But be careful, bad decisions decrease them! Make sure you always keep a good balance.`,
          ],
          []
  );

  const replaceChildren = useCallback((parent: PixiContainer, nodes: PixiContainer[]) => {
    const removed = parent.removeChildren();
    removed.forEach((c) => c.destroy?.());
    nodes.forEach((n) => parent.addChild(n));
  }, []);

  const runIntroAnim = useCallback(
          async (robot: PixiSprite, growProps: GrowProps, fadeIn: FadeProps) => {
            const mgr = mgrRef.current!;
            const graphic = graphicRef.current;
            const text = textRef.current;
            if (!graphic || !text) return;

            await mgr.parallel([
              () => growAnimation(mgr, robot, growProps),
              () => fadeAnimation(mgr, [graphic, text], fadeIn),
            ]);
          },
          [mgrRef]
  );

  const runOutroAnim = useCallback(
          async (robot: PixiSprite, fadeOut: FadeProps) => {
            const mgr = mgrRef.current!;
            const graphic = graphicRef.current;
            const text = textRef.current;
            if (!graphic || !text) return;

            await mgr.parallel([() => fadeAnimation(mgr, [robot, graphic, text], fadeOut)]);
          },
          [mgrRef]
  );

  const anim1 =useMemo<GrowProps>(() =>  {
    return {
    startX: windowWidth * 0.7,
    startY: windowHeight * 0.4,
    endX: windowWidth * 0.7,
    endY: windowHeight * 0.4,
    startS: Math.min(windowWidth, windowHeight) / 4000,
    endS: Math.min(windowWidth, windowHeight) / 2000,
    duration: 750,
    }
  }, [windowWidth, windowHeight])

  useEffect(() => {
    if (!mgrRef.current) return;

    const robot = robotRef.current;
    if (!robot) return;

    const run = async () => {
      switch (animation) {
        case Animations.INTRO: {
          if (introRun)return
          const fadeIn: FadeProps = { duration: 500, startA: 0, endA: 1 };

          setAnimating(true);
          await runIntroAnim(robot, anim1, fadeIn);
          setAnimating(false);
          setAnimation(Animations.IDLE);
          setIntroRun(true)
          break;
        }
        case Animations.OUTRO: {
          const fadeOut: FadeProps = { duration: 500, startA: 1, endA: 0 };
          setAnimating(true);
          await runOutroAnim(robot, fadeOut);
          setAnimating(false);
          setAnimation(Animations.IDLE);
          setKeyControl(Pages.PROGRESS_BAR);
          break;
        }
      }
    };

    run();
  }, [
    animation, Animations.IDLE, Animations.INTRO, Animations.OUTRO,
    mgrRef, runIntroAnim, runOutroAnim, setKeyControl, introRun, anim1
  ]);

  useEffect(() => {
    const sprite = robotRef.current
    if(!sprite || animating)return;
    sprite.x = anim1.endX
    sprite.y = anim1.endY
    sprite.scale.set(anim1.endS)
  }, [windowWidth, windowHeight, anim1.endS, anim1.endY, anim1.endX, animating]);

  useEffect(() => {
    if (keyControl != Pages.SCORE_CHANGES || animating) return;

    const onSpecialPressed = (e: KeyboardEvent) => {
      if (e.code === "Space") setAnimation(Animations.OUTRO);
    };

    window.addEventListener("keydown", onSpecialPressed);
    return () => window.removeEventListener("keydown", onSpecialPressed);
  }, [keyControl, animating, Animations.OUTRO]);


  const setupTexts = useCallback(() => {
    const t1 = new PixiText();
    t1.text = textsTemp[0];
    t1.x = windowWidth * 0.825;
    t1.y = windowHeight * 0.575;
    t1.style = new TextStyle({
      fontSize: Math.min(windowWidth, windowHeight) * 0.035,
      fontWeight: "normal",
      wordWrapWidth: windowWidth * 0.25,
    });

    setPixiTexts([t1]);
  }, [textsTemp, windowWidth, windowHeight]);

  const setupBackground = useCallback(() => {
    const parent = backgroundRef.current;
    if (!parent) return;

    const b = new PixiGraphics();
    b.clear();
    b.beginFill("#000000", 0.7);
    b.drawRect(0, 0, windowWidth, windowHeight);
    b.beginHole();
    b.drawRoundedRect(
            0.855*windowWidth,
            0.01*windowHeight,
            windowWidth * 0.14,
            windowHeight * 0.155,
            10
    );
    b.endHole();
    b.endFill();

    replaceChildren(parent, [b]);
  }, [replaceChildren, windowWidth, windowHeight]);

  const setupGraphics = useCallback(() => {
    const parent = graphicRef.current;
    if (!parent) return;

    const g = new PixiGraphics();
    g.clear();
    g.beginFill(fill, 1);
    g.lineStyle(Math.min(windowWidth, windowHeight) / 150, stroke);
    g.drawRoundedRect(windowWidth * 0.7, windowHeight * 0.45, windowWidth * 0.25, windowHeight * 0.25, 12);
    g.endFill();

    replaceChildren(parent, [g]);
  }, [replaceChildren, windowWidth, windowHeight]);

  const setupRobot = useCallback(() => {
    const r = robotRef.current;
    if (!r) return;

    r.anchor.set(0.5, 0.5);
    r.x = windowWidth * 0.7;
    r.y = windowHeight * 0.4;
    r.texture = textureRobot;
    r.scale.set(Math.min(windowWidth, windowHeight) / 2000);
  }, [textureRobot, windowWidth, windowHeight]);

  useLayoutEffect(() => {
    if (!initedRef.current) {
      initedRef.current = true;
      gameService?.pauseGame();
      // delay one frame so refs are definitely set before we draw
      const id = requestAnimationFrame(() => setAnimation(Animations.INTRO));
      return () => cancelAnimationFrame(id);
    }
  }, [gameService, Animations.INTRO]);

  useEffect(() => {
    if (!initedRef.current) {
      initedRef.current = true;
      gameService?.pauseGame();
      setAnimation(Animations.INTRO);
    }

    setupBackground();
    setupTexts();
    setupGraphics();
    setupRobot();
  }, [
    gameService,
    Animations.INTRO,
    setupBackground,
    setupTexts,
    setupGraphics,
    setupRobot,
    windowWidth,
    windowHeight,
  ]);

  const graphics = () => (
          <Container>
            <Container ref={graphicRef} />
          </Container>
  );

  const background = () => (
          <Container>
            <Container ref={backgroundRef} />
          </Container>
  );

  const texts = () => (
          <Container ref={textRef}>
            {pixiTexts.map((msg, i) => (
                    <Text
                            key={i}
                            text={msg.text}
                            x={msg.x}
                            y={msg.y}
                            anchor={0.5}
                            style={
                              new TextStyle({
                                fontFamily: "LoResRegular",
                                fontSize: msg.style.fontSize,
                                fontWeight: msg.style.fontWeight,
                                fill: "#FFFFFF",
                                align: "left",
                                wordWrap: true,
                                wordWrapWidth: msg.style.wordWrapWidth,
                              })
                            }
                    />
            ))}
          </Container>
  );

  return (
          <>
            {background()}
            {textureRobot && <Sprite texture={textureRobot} ref={robotRef} />}
            {graphics()}
            {texts()}
          </>
  );
};
