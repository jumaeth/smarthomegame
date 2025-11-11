import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Container, Sprite, Text } from "@pixi/react";
import waving from "@/assets/tutorial/finalExpl/waving.png";
import { loadTexture } from "@/utils/loadTexture";
import {
  Container as PixiContainer,
  Graphics as PixiGraphics,
  Sprite as PixiSprite,
  Text as PixiText,
  TextStyle,
} from "pixi.js";
import { Pages } from "@/pixi/components/Tutorial/Pages/Pages";
import { AnimationManager } from "@/pixi/components/Tutorial/anim/AnimationManager";
import { PageProps } from "@/pixi/components/Tutorial/Pages/pageRegistry";
import { fadeAnimation, FadeProps } from "@/pixi/components/Tutorial/anim/fadeAnimation";
import { PageOrder } from "@/pixi/components/Tutorial/util/PageOrder";
import { FADE_IN, FADE_OUT } from "@/pixi/components/Tutorial/util/AnimProps";
import { t } from "@lingui/core/macro";
import {fill, stroke} from "@/pixi/components/Tutorial/util/TutorialColors.ts";

export const Final_Message: React.FC<PageProps> = ({
                                                     windowWidth,
                                                     windowHeight,
                                                     keyControl,
                                                     setKeyControl,
                                                     setNextPage,
                                                   }: PropsWithChildren<PageProps>) => {
  const enum Animations { IDLE, INTRO, OUTRO }

  const textureRobot = useMemo(() => loadTexture(waving), []);
  const robotRef = useRef<PixiSprite | null>(null);
  const [animation, setAnimation] = useState(Animations.IDLE);
  const [pixiTexts, setPixiTexts] = useState<PixiText[]>([]);
  const [animating, setAnimating] = useState(false);
  const mgrRef = useRef<AnimationManager | null>(null);
  const graphicRef = useRef<PixiContainer | null>(null);
  const textRef = useRef<PixiContainer | null>(null);
  const backgroundRef = useRef<PixiContainer | null>(null);
  const initedRef = useRef(false);
  const [introRun, setIntroRun] = useState(false);

  const textsTemp = useMemo(
          () => [t`That's it, now you are ready to save the smart home and make that movie night possible!`],
          []
  );

  // Animations
  useEffect(() => {
    mgrRef.current = new AnimationManager();
    return () => mgrRef.current?.cancelAll();
  }, []);

  const runIntroAnim = async (robot: PixiSprite, fadeIn: FadeProps) => {
    const mgr = mgrRef.current!;
    const graphic = graphicRef.current;
    const text = textRef.current;
    if (!graphic || !text) return;
    await mgr.parallel([() => fadeAnimation(mgr, [robot, graphic, text], fadeIn)]);
  };

  const runOutroAnim = async (robot: PixiSprite, fadeOut: FadeProps) => {
    const mgr = mgrRef.current!;
    const graphic = graphicRef.current;
    const bg = backgroundRef.current;
    const text = textRef.current;
    if (!graphic || !text || !bg) return;
    await mgr.parallel([() => fadeAnimation(mgr, [bg, robot, graphic, text], fadeOut)]);
  };

  useEffect(() => {
    if (!mgrRef.current) return;
    const robot = robotRef.current;
    if (!robot) return;

    (async () => {
      switch (animation) {
        case Animations.INTRO:
          if(introRun)return
          setAnimating(true);
          await runIntroAnim(robot, FADE_IN);
          setAnimating(false);
          setAnimation(Animations.IDLE);
          setIntroRun(true)
          break;

        case Animations.OUTRO:
          setAnimating(true);
          await runOutroAnim(robot, FADE_OUT);
          setAnimating(false);
          setAnimation(Animations.IDLE);
          setKeyControl(Pages.MAIN);
          setNextPage(PageOrder.END);
          break;
      }
    })();
  }, [animation, setKeyControl, setNextPage, Animations.IDLE, Animations.INTRO,
  Animations.OUTRO, introRun]);

  // Input
  useEffect(() => {
    if (keyControl !== Pages.FINAL_MESSAGE || animating) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") setAnimation(Animations.OUTRO);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keyControl, animating, Animations.OUTRO]);

  // Utilities
  const replaceChildren = useCallback((parent: PixiContainer, nodes: PixiContainer[]) => {
    const old = parent.removeChildren();
    old.forEach((c) => c.destroy?.());
    nodes.forEach((n) => parent.addChild(n));
  }, []);

  // Drawings (reactive)
  const setupTexts = useCallback(() => {
    const t1 = new PixiText();
    t1.text = textsTemp[0];
    t1.x = windowWidth * 0.5;
    t1.y = windowHeight * 0.575;
    t1.style = new TextStyle({
      fontSize: Math.min(windowWidth, windowHeight) * 0.035,
      fontWeight: "normal",
      wordWrapWidth: windowWidth * 0.295,
    });
    setPixiTexts([t1]); // replace
  }, [textsTemp, windowWidth, windowHeight]);

  const setupBackground = useCallback(() => {
    const parent = backgroundRef.current;
    if (!parent) return;
    const b = new PixiGraphics();
    b.clear();
    b.beginFill("#000000", 0.7);
    b.drawRect(0, 0, windowWidth, windowHeight);
    b.endFill();
    replaceChildren(parent, [b]);
  }, [replaceChildren, windowWidth, windowHeight]);

  const setupGraphics = useCallback(() => {
    const parent = graphicRef.current;
    if (!parent) return;
    const g = new PixiGraphics();
    g.clear();
    g.beginFill(fill, 1);
    g.lineStyle(3, stroke);
    g.drawRoundedRect(windowWidth * 0.35, windowHeight * 0.5, windowWidth * 0.3, windowHeight * 0.15, 12);
    g.endFill();
    replaceChildren(parent, [g]);
  }, [replaceChildren, windowWidth, windowHeight]);

  const setupRobot = useCallback(() => {
    const r = robotRef.current;
    if (!r) return;
    r.anchor.set(0.5, 0.5);
    r.x = windowWidth * 0.5;
    r.y = windowHeight * 0.3;
    r.scale.set(Math.min(windowWidth, windowHeight) / 1000);
    r.texture = textureRobot;
  }, [textureRobot, windowWidth, windowHeight]);

  // Init once, then react to size
  useEffect(() => {
    if (!initedRef.current) {
      initedRef.current = true;
      setAnimation(Animations.INTRO);
    }
    setupBackground();
    setupGraphics();
    setupTexts();
    setupRobot();
  }, [setupBackground, setupGraphics, setupTexts, setupRobot, windowWidth, windowHeight, Animations.INTRO]);

  // Render
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
