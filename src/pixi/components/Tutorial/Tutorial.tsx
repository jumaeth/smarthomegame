import React, {PropsWithChildren, useEffect, useRef, useState} from "react";
import {Container, Graphics} from "@pixi/react";
import {Container as PixiContainer, Graphics as PixiGraphics, Rectangle, Text, TextStyle} from "pixi.js";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {CharacterPage} from "@/pixi/components/Tutorial/CharacterPage.tsx";
import {Pages} from "@/pixi/components/Tutorial/Pages.ts";
import {PAGE_COMPONENTS, PageProps} from "@/pixi/components/Tutorial/pageRegistry.ts";

interface TutorialProps {
  windowWidth: number;
  windowHeight: number;
  characterPositon: { x: number, y: number };
}


export const Tutorial: React.FC<TutorialProps> = ({
       windowWidth,
       windowHeight,
       gameService,
       characterPositon
           }: PropsWithChildren<TutorialProps>) => {

  type SpotRect = { x: number; y: number; width: number; height: number; r: number };

  const [showExplanation, setShowExplanation] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showBackground, setShowBackground] = useState(true);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [instrBlinking, setInstrBlinking] = useState(true);
  const [spotLightAnimation, setSpotLightAnimation] = useState(1);
  const [curFeature, setcurFeature] = useState(0);
  const [animating, setAnimating] = useState(false);

  const rootRef = useRef<PixiContainer | null>(null);
  const explRef = useRef<Text | null>(null);
  const instrRef = useRef<Text | null>(null);

  const spotRectRef = useRef<SpotRect>({ x: 0, y: 0, width: 200, height: 200, r: 10 });
  const backgroundRef = useRef<PixiGraphics | null>(null);
  const [animationState, setAnimationState] = useState({ a1: false });
  const [keyControl, setKeyControl] = useState(Pages.Main)

  const commonProps: PageProps = { windowWidth, windowHeight, keyControl, setKeyControl };
  const ActivePage = PAGE_COMPONENTS[keyControl]; // Component or null

  //pause game at beginning of tutorial
  useEffect(() => {
    gameService.pauseGame();
  }, [gameService]);

  //draw bg on load
  useEffect(() => {
    if (backgroundRef.current){
        drawBackground();
    }
  }, [backgroundRef.current]);

  //explanation initialisation
  useEffect(() => {
    if (!rootRef.current || explRef.current) return;

    if (rootRef.current instanceof PixiContainer) {
      const t = new Text("Welcome to the tutorial", new TextStyle({
        fontFamily: "LoResRegular",
        fontSize: Math.min(windowWidth, windowHeight) * 0.06,
        fill: "#ffffff"
      }));
      t.anchor.set(0.5);
      t.alpha = 1;
      t.x = windowWidth / 2;
      t.y = windowHeight / 3;

      rootRef.current.addChild(t);
      explRef.current = t;


        return () => {
          if (t.parent && t.parent instanceof PixiContainer) t.parent.removeChild(t);
            if (!rootRef.current?.destroyed && !t.destroyed) t.destroy();
              explRef.current = null;
         };
    }
  }, []);

  //instruction initialisation
  useEffect(() => {
    if (!rootRef.current || instrRef.current) return;

    if (rootRef.current instanceof PixiContainer) {
      const t = new Text("Press space to advance", new TextStyle({
        fontFamily: "LoResRegular",
        fontSize: Math.min(windowWidth, windowHeight) * 0.0475,
        fill: "#ffffff"
      }));
      t.anchor.set(0.5);
      t.alpha = 1;
      t.x = windowWidth / 2;
      t.y = windowHeight / 3 + windowHeight * 0.075;

      rootRef.current.addChild(t);
      instrRef.current = t;


      return () => {
        if (t.parent && t.parent instanceof PixiContainer) t.parent.removeChild(t);
        if (!rootRef.current?.destroyed && !t.destroyed) t.destroy();
        instrRef.current = null;
      };
    }
  }, []);

  const drawSpotlight = () => {
    const g = backgroundRef.current;
    const r = spotRectRef.current;
    if (!g || !r) return;
    g.clear();
    g.alpha = 0.7;
    g.beginFill(0x000000);
    g.drawRect(0, 0, windowWidth, windowHeight);
    g.beginHole();
    g.drawRoundedRect(r.x, r.y, r.width, r.height, r.r);
    g.endHole();
    g.endFill();
  };

  const drawBackground = ()=> {
    const g = backgroundRef.current;
    console.log("cehck: "+g && showBackground+"/");
    if (g && showBackground) {
      g.clear();
      g.alpha = 0.7;
      g.beginFill(0x000000);
      g.drawRect(0, 0, windowWidth, windowHeight);
      g.endFill();
    }
  }

  //show/hide explanation
  useEffect(() => {
    if (explRef.current && explRef.current instanceof Text) {
      explRef.current.visible = showExplanation;
    }
  }, [showExplanation]);

  //show/hide instruction
  useEffect(() => {
    if (instrRef.current && instrRef.current instanceof Text) {
      instrRef.current.visible = showInstruction;
    }
  }, [showInstruction]);

  //resize window
  useEffect(() => {
    if (explRef.current && explRef.current instanceof Text) {
      explRef.current.x = windowWidth / 2;
      explRef.current.y = windowHeight / 3;
      explRef.current.style.fontSize = Math.min(windowWidth, windowHeight) * 0.06;
    }
    if (instrRef.current && instrRef.current instanceof Text){
      instrRef.current.x = windowWidth / 2
      instrRef.current.y = windowHeight / 3 + windowHeight * 0.075;
      instrRef.current.style.fontSize = Math.min(windowWidth, windowHeight) * 0.0475;
    }

    if(showBackground){
      drawBackground();
    }

    if(showSpotlight && animationState.a1){
      spotRectRef.current = computeEndRect();
      drawSpotlight()
    }
  }, [windowWidth, windowHeight]);

  //instruction blinking
  useEffect(() => {
    if (!instrBlinking || !showInstruction) return;

    let rafId: number;
    const dir = { current: -1 as 1 | -1 };
    const speed = 0.008;
    const tick = () => {

      const t = instrRef.current;
      if (t) {
        t.alpha += dir.current * speed;

        if (t.alpha <= 0) { t.alpha = 0; dir.current = 1; }
        else if (t.alpha >= 1) { t.alpha = 1; dir.current = -1; }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [instrBlinking, showInstruction]);

  //key events
  useEffect(() => {
    if(keyControl != Pages.Main)return;
    const onSpacePressed = (e: KeyboardEvent) => {
      if(e.code == "Space"){
        setShowBackground(false);
        setInstrBlinking(false);
        setShowExplanation(false);
        setShowInstruction(false);
        setShowSpotlight(true);
      }
    }

    const onNumberPressed = (e: KeyboardEvent) => {
      if(e.key == 1){
        setSpotLightAnimation(1);
      }

      if(e.key == 2){
        setSpotLightAnimation(2);
      }
      if(e.key == 3){
        drawBackground();
      }

    }

    const onLetterPressed = (e: KeyboardEvent) => {
      if(e.key == "p"){
        if(!gameService.isPaused()){
          gameService.pauseGame();
        }else{
          gameService.resumeGame();
        }
      }

      if (e.key == "c"){
        switch (curFeature){
          case 1:
            drawBackground();
            setKeyControl(Pages.Character);
        }
      }
    }


    const events = [onSpacePressed, onNumberPressed, onLetterPressed];


    events.forEach(func => window.addEventListener("keydown", func));
    return () => {
      events.forEach(func => window.removeEventListener("keydown", func));
    };
  }, [keyControl, gameService, windowWidth, windowHeight]);

  //animate moving spotlight
  const animateSpotlight = (start: SpotRect, end: SpotRect, duration: number, feature: number) =>  {
    if (!showSpotlight || spotLightAnimation !== 1 || animating) return;
    if (!explRef.current || !(explRef.current instanceof Text)) return;
    if (!backgroundRef.current) return;

    let rafId = 0;
    const startTime = performance.now();
    setAnimating(true);


    spotRectRef.current = start;
    drawSpotlight();


    //distance traveled
    const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

    const tick = (now: number) => {
      const p = Math.min(1, (now - startTime) / duration);

      spotRectRef.current = {
        x: lerp(start.x, end.x, p),
        y: lerp(start.y, end.y, p),
        width: lerp(start.width, end.width, p),
        height: lerp(start.height, end.height, p),
        r: start.r
      };

      if (backgroundRef.current) {
        drawSpotlight();
      }

      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setAnimationState(s => ({ ...s, a1: true }));
        spotRectRef.current = end;
        setSpotLightAnimation(0);
        if (backgroundRef.current) {
          drawSpotlight();
        }
        setAnimating(false);
        setcurFeature(feature);
      }

    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
    }
  }

  //compute end of animation
  const computeEndRect = () => {

    return {
      x: (0.5*windowWidth),
      y: (0.5*windowHeight)+TILE_SIZE*1.75,
      width: TILE_SIZE*8,
      height: TILE_SIZE*8,
      r: 10,
    } as SpotRect;
  };

  //manage animations
  useEffect(() => {
    switch (spotLightAnimation){
      case 1:
        if(explRef.current && explRef.current instanceof Text){
          const b = explRef.current.getBounds();
          const b2 = instrRef.current?.getBounds();
          const border = 10;

          const start = {
            x: b.x - 10,
            y: b.y - 10,
            width: b.width + 20,
            height: b.height + (b2?.height ?? 0) + 20,
            r: 10,
          };

          const end = computeEndRect();

          animateSpotlight(start, end, 1000, 1);
        }

        break;

      case 2:
          computeEndRect();
          drawSpotlight();
        break;
    }


  }, [showSpotlight, spotLightAnimation, characterPositon]);

  useEffect(() => {
    if (curFeature == 1 && !animating){
      setShowBackground(true);
      if (!animating && showBackground){
        drawBackground()
        setKeyControl(Pages.Character);
      }
    }
  }, [curFeature, showBackground]);


  //background
  const background = () => {
    return (
            <>
              <Graphics ref={backgroundRef} />
            </>
    )
  }

  return (
      <>
        {background()}
        {ActivePage && <ActivePage key={keyControl} {...commonProps} />}
        <Container
        eventMode="static"
        ref={rootRef}
        sortableChildren={true}
        hitArea={new Rectangle(0, 0, windowWidth, windowHeight)}
        />
      </>
  )
};