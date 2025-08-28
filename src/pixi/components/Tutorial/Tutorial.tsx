import React, {PropsWithChildren, useEffect, useRef, useState} from "react";
import {Container, Graphics} from "@pixi/react";
import {Container as PixiContainer, Graphics as PixiGraphics, Text, TextStyle} from "pixi.js";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {PAGE_COMPONENTS, PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {AnimationManager} from "@/pixi/components/Tutorial/anim/AnimationManager.ts";
import {spotlightTween} from "@/pixi/components/Tutorial/anim/spotlightTween.ts";
import {fadeAnimation, FadeProps} from "@/pixi/components/Tutorial/anim/fadeTween.ts";
import {GameService} from "@/services/GameService.ts";
import {characterPositionStore} from "@/utils/characterPosition.ts";
import {movementStore} from "@/utils/movementEnabled.ts";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {Position} from "@/types/movement.ts";

interface TutorialProps {
  windowWidth: number;
  windowHeight: number;
  gameService: GameService;
  onClose: () => void;
  interactiveElements:  InteractivePixiElement[];
}

export const Tutorial: React.FC<TutorialProps> = ({
       windowWidth,
       windowHeight,
       gameService,
       onClose,
        interactiveElements
           }: PropsWithChildren<TutorialProps>) => {

  type SpotRect = { x: number; y: number; width: number; height: number; r: number };

  const [showExplanation, setShowExplanation] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showBackground, setShowBackground] = useState(true);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [instrBlinking, setInstrBlinking] = useState(true);
  const [nextPage, setNextPage] = useState(0);
  const [curFeature, setcurFeature] = useState(0);

  const rootRef = useRef<PixiContainer | null>(null);
  const explRef = useRef<Text | null>(null);
  const instrRef = useRef<Text | null>(null);

  const spotRectRef = useRef<SpotRect>({ x: 0, y: 0, width: 200, height: 200, r: 10 });
  const backgroundRef = useRef<PixiGraphics | null>(null);
  const [keyControl, setKeyControl] = useState(Pages.MAIN)

  const commonProps: PageProps = { windowWidth, windowHeight, keyControl, setKeyControl, setNextPage, interactiveElements, gameService };
  const ActivePage = PAGE_COMPONENTS[keyControl]; // Component or null

  const mgrRef = useRef<AnimationManager | null>(null);
  const pressedRef = useRef<boolean>(false);

  //manage animations
  useEffect(() => {
    if (!mgrRef.current) return;

    let timeoutId: number | undefined;
    let cancelled = false;

    const run = async () => {
      switch (nextPage) {

        case 1: {
          if (!explRef.current) return;
          if (explRef.current instanceof Text) {
            const b = explRef.current.getBounds();

            const b2 = instrRef.current?.getBounds();
            const start = {
              x: b.x - 10,
              y: b.y - 10,
              width: b.width + 20,
              height: b.height + (b2?.height ?? 0) + 20,
              r: 10,
            };
            const end = computeEndRect(1)!;

            setShowSpotlight(true);
            await runSpotlightAnim(drawSpotlight, start, end, 1000);
            if (cancelled) return;

            setShowSpotlight(false);
            drawBackground();

            setKeyControl(Pages.CHARACTER);
            setNextPage(0);

            return;
          }
          return;
        }

        case 2: {
          const start = computeEndRect(1)!;
          const end = computeEndRect(2)!;

          setShowSpotlight(true);
          drawSpotlight(spotRectRef.current);

          timeoutId = window.setTimeout(async () => {
            setShowSpotlight(false);
            await runSpotlightAnim(drawSpotlight, start, end, 1000);
            if (cancelled) return;
            setShowSpotlight(false);
            drawBackground();

            setKeyControl(Pages.SCORES);
            setNextPage(0);
          }, 250);
          return;
        }

        case 3: {
          const start = computeEndRect(2)!;
          const end = computeEndRect(3)!;

          setShowSpotlight(true);
          drawSpotlight(spotRectRef.current);

          timeoutId = window.setTimeout(async () => {
            await runSpotlightAnim(drawSpotlight, start, end, 1000);
            if (cancelled) return;
            setShowSpotlight(false);
            drawBackground();

            setKeyControl(Pages.SMARTPHONE );
            setNextPage(0);
          }, 250);
          return;
        }

        case 4: {
          setKeyControl(Pages.DECISION);
          return;
        }
        case 5: {
          const start = {
            x: windowWidth*0.5,
            y: windowHeight*0.5,
            width: windowWidth * 0.065,
            height: windowHeight * 0.19,
            r: 10
          }as SpotRect

          const end = computeEndRect(4);

          setShowSpotlight(true);
          await runSpotlightAnim(drawSpotlight, start, end, 1000);
          if (cancelled) return;
          drawBackground();

          setKeyControl(Pages.MORE_EXPL);
          return;
        }

        case 6: {
          await runClearBGAnim();
          gameService.resumeGame();
          return;
        }
        case 7: {
          await runClearBGAnim();
          gameService.resumeGame();
          setKeyControl(Pages.More_Expl_SD);
          return;
        }
        case 8: {
          const start = computeEndRect(5);
          const end = computeEndRect(2);

          characterPositionStore.teleport({x: 5*TILE_SIZE, y: 3*TILE_SIZE});
          setShowSpotlight(true);
          await runSpotlightAnim(drawSpotlight, start, end, 750);
          if (cancelled) return;

          const bg = backgroundRef.current;
          if (!bg) return;
          bg.clear();

          setKeyControl(Pages.SCORE_CHANGES);
          return;
        }

        case 9: {
          onClose();
          return;
        }

      }
    };

    run();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [nextPage]);


  //----------init----------

  const disableMovement = () => {
    if (movementStore.getSnapshot().movementEnabled){
      movementStore.disable();
    }
  }

  const enableMovement = () => {
    if (!movementStore.getSnapshot().movementEnabled){
      movementStore.enable();
    }
  }

  //pause game at beginning of tutorial
  useEffect(() => {
    characterPositionStore.teleport({x: 8*TILE_SIZE, y: 5*TILE_SIZE});
    gameService.pauseGame();
  }, []);

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

  useEffect(() => {
    const devices = gameService.getDeviceForRoom("livingroom");
    const tv = devices.find(d => d.name === "SmartTv");

    if (!tv) return;

    const unsubscribe = tv.subscribe(device => {
      if (device.getIsCompleted()) {
        setNextPage(8);
      }
    });

    return () => unsubscribe();
  }, []);



  //----------anim / drawings----------

  //cleanup animation manager
  useEffect(() => {
    mgrRef.current = new AnimationManager();
    try{
      mgrRef.current?.cancelAll()
    }catch (e: Error){}
    return;
  }, []);

  //run animations
  const runSpotlightAnim = async (drawSpotlight:  (rect: SpotRect) => void, start: SpotRect, end: SpotRect, duration: number ) => {
    const mgr = mgrRef.current!;

    await mgr.sequence([
      () => spotlightTween(mgr, drawSpotlight, start, end, duration),
    ]);
  };

  //draw backgrounds
  const drawSpotlight = (rect: SpotRect) => {
    const g = backgroundRef.current;
    spotRectRef.current = rect;
    if (!g || !rect) return;

    g.clear();
    g.alpha = 0.7;
    g.beginFill(0x000000);
    g.drawRect(0, 0, windowWidth, windowHeight);
    g.beginHole();
    g.drawRoundedRect(rect.x, rect.y, rect.width, rect.height, rect.r);
    g.endHole();
    g.endFill();
  };

  const drawBackground = ()=> {
    const g = backgroundRef.current;
    if (g) {
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


  useEffect(() => {
    const mgr = mgrRef.current;
    const txt = instrRef.current;
    if (!mgr || !txt)return;
    if (!instrBlinking || !showInstruction) return;

    const speed = 2000;

    const { promise } = mgr.runUntil(
            () => {
              return [
                () => ({

                  promise: mgr.sequence([
                    () => fadeAnimation(mgr, txt, {duration: speed, startA: 0.8, endA: 0}),
                    () => fadeAnimation(mgr, txt, {duration: speed, startA: 0, endA: 0.8})
                  ])
                }),
              ];
            },
            { mode: "sequence", until: () => pressedRef.current, delayMs: 100 }
    );
  }, [instrBlinking, showInstruction]);

  //compute end of animation
  const computeEndRect = (anim: number) => {

    switch (anim){
      case 1:
        return {
          x: (0.5*windowWidth),
          y: (0.5*windowHeight)+TILE_SIZE*1.75,
          width: TILE_SIZE*8,
          height: TILE_SIZE*8,
          r: 10,
        } as SpotRect;

      case 2:
        return {
          x: (0.86*windowWidth),
          y: (0.01*windowHeight)-TILE_SIZE*0.25,
          width: TILE_SIZE*16.5,
          height: TILE_SIZE*7.5,
          r: 10,
        } as SpotRect;

      case 3:
        return {
          x: (0.006*windowWidth),
          y: (0.0125*windowHeight),
          width: TILE_SIZE*8,
          height: TILE_SIZE*12,
          r: 10,
        } as SpotRect;

      case 4:
        return {
          x: windowWidth*0.165,
          y: 0,
          width: windowWidth * 0.155,
          height: windowHeight * 0.21,
          r: 10
        } as SpotRect;
      case 5:
        return {
          x: windowWidth*0.42,
          y: windowHeight*0.325,
          width: windowWidth * 0.1475,
          height: windowHeight * 0.21,
          r: 10
        } as SpotRect;
    }

  };

  //background
  const background = () => {
    return (
            <>
              <Graphics ref={backgroundRef} />
            </>
    )
  }


  //----------user input----------

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

    if(showSpotlight){
      spotRectRef.current = computeEndRect(nextPage);
      drawSpotlight(spotRectRef.current);
    }
  }, [windowWidth, windowHeight]);

  //key events
  useEffect(() => {
    if(keyControl != Pages.MAIN)return;
    const onSpacePressed = (e: KeyboardEvent) => {
      if(e.code == "Space" && showExplanation){
        setShowBackground(false);
        setInstrBlinking(false);
        setShowExplanation(false);
        setShowInstruction(false);
        setShowSpotlight(true);
        setNextPage(1);
      }
      if(e.code == "a"){
        setNextPage(8);
      }
    }


    const events = [onSpacePressed];


    events.forEach(func => window.addEventListener("keydown", func));
    return () => {
      events.forEach(func => window.removeEventListener("keydown", func));
    };
  }, [keyControl, gameService, windowWidth, windowHeight]);

  const runClearBGAnim = async () => {

    const mgr = mgrRef.current;
    const bg = backgroundRef.current;

    if(!mgr || !bg)return;

    const durationOut = 1000;

    const fadeOut = {
      duration: durationOut,
      startA: bg.alpha,
      endA: 0,
    } as FadeProps

    await mgr.parallel([
      () => fadeAnimation(mgr, bg, fadeOut),
    ]);
  }

  return (
      <>
        {background()}
        <Container ref={rootRef}/>
        {ActivePage && <ActivePage key={keyControl} {...commonProps} />}
      </>
  )
};