import React, {PropsWithChildren, useCallback, useEffect, useRef, useState} from "react";
import {Container as PixiContainer, Rectangle, Text, TextStyle} from "pixi.js";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {PageOrder} from "@/pixi/components/Tutorial/util/PageOrder.ts";
import {Container} from "@pixi/react";
import {useAnimationManager} from "@/hooks/tutorial/useAnimationManager.tsx";
import {blinkingAnimation} from "@/pixi/components/Tutorial/anim/blinkingAnimation.ts";
import {t} from "@lingui/core/macro";


export const IntroPage: React.FC<PageProps> = ({
        windowWidth,
        windowHeight,
        keyControl,
        setKeyControl,
        setNextPage
           }: PropsWithChildren<PageProps>) => {

  //states
  const [showInstruction, setShowInstruction] = useState(true);
  const [instrBlinking, setInstrBlinking] = useState(true);

  //refs
  const pressedRef = useRef<boolean>(false);
  const rootRef = useRef<PixiContainer | null>(null);
  const explRef = useRef<Text | null>(null);
  const instrRef = useRef<Text | null>(null);

  const welcomeMsg = t`Welcome to the tutorial`
  const instrMsg = t`Press space or touch to advance`

  //hooks
  const mgrRef = useAnimationManager();

  //init explanation
  useEffect(() => {
    const root = rootRef.current;
    if (!root || explRef.current) return;

    const t = new Text(welcomeMsg, new TextStyle({
      fontFamily: "LoResRegular",
      fontSize: Math.min(windowWidth, windowHeight) * 0.06,
      fill: "#ffffff"
    }));
    t.anchor.set(0.5);
    t.alpha = 1;
    t.x = windowWidth / 2;
    t.y = windowHeight / 3;
    root.addChild(t);
    explRef.current = t;
    return () => {
      if (t.parent && t.parent instanceof PixiContainer) t.parent.removeChild(t);
      if (!root.destroyed && !t.destroyed) t.destroy();
      explRef.current = null;
    };
  }, [welcomeMsg, windowWidth, windowHeight]);

  //init instruction
  useEffect(() => {
    const root = rootRef.current;
    if (!root || instrRef.current) return;

    const t = new Text(
            instrMsg,
            new TextStyle({
              fontFamily: "LoResRegular",
              fontSize: Math.min(windowWidth, windowHeight) * 0.0475,
              fill: "#ffffff",
            })
    );
    t.anchor.set(0.5);
    t.alpha = 1;
    t.x = windowWidth / 2;
    t.y = windowHeight / 3 + windowHeight * 0.075;
    root.addChild(t);
    instrRef.current = t;
    return () => {
      if (t.parent && t.parent instanceof PixiContainer) t.parent.removeChild(t);
      if (!root.destroyed && !t.destroyed) t.destroy();
      instrRef.current = null;
    };
  }, [instrMsg, windowWidth, windowHeight]);


  //animate texts
  useEffect(() => {
    const mgr = mgrRef.current;
    const txt = instrRef.current;
    if (!mgr || !txt || !instrBlinking || !showInstruction)return;

    const speed = 2000;

    const run = async () => {
      await mgr.sequence([ () => blinkingAnimation(mgr, txt, speed, pressedRef)]);
    }
    run();

  }, [instrBlinking, showInstruction, mgrRef]);

  const continueTutorial = useCallback(() => {
    setInstrBlinking(false);
    setShowInstruction(false);
    pressedRef.current = true;
    setNextPage(PageOrder.CHARACTER);
    setKeyControl(Pages.MAIN);
  },[])

  //key controls
  useEffect(() => {
    if(keyControl != Pages.INTRO)return;
    const onSpacePressed = (e: KeyboardEvent) => {
      if(e.code == "Space"){
        continueTutorial()
      }
    }

    const events = [onSpacePressed];


    events.forEach(func => window.addEventListener("keydown", func));
    return () => {
      events.forEach(func => window.removeEventListener("keydown", func));
    };
  }, [keyControl, windowWidth, windowHeight, setKeyControl, setNextPage]);

  return (
      <>
          <Container
                  ref={rootRef}
          />
      </>
  )
};