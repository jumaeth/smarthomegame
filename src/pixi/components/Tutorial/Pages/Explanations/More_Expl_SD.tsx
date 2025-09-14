import React, {PropsWithChildren, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Container, Sprite, Text} from "@pixi/react";
import {loadTexture} from "@/utils/loadTexture.ts";
import {
  Container as PixiContainer,
  Graphics as PixiGraphics,
  Sprite as PixiSprite,
  Text as PixiText,
  TextStyle
} from "pixi.js";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {growAnimation, GrowProps} from "@/pixi/components/Tutorial/anim/growAnimation.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {useCharacterControls} from "@/hooks/character/useCharacterControls.ts";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {useCharacterPosition} from "@/hooks/character/useCharacterPosition.ts";
import {fadeAnimation} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import robot from "@/assets/tutorial/explainTVPage/pointing.png";
import {toggleExplanations} from "@/pixi/components/Tutorial/util/drawings.tsx";
import {FADE_IN, FADE_OUT} from "@/pixi/components/Tutorial/util/AnimProps.ts";
import {useAnimationManager} from "@/hooks/tutorial/useAnimationManager.tsx";
import {PageOrder} from "@/pixi/components/Tutorial/Tutorial.tsx";
import {t} from "@lingui/core/macro";


export const More_Expl_SD: React.FC<PageProps> = ({
        windowWidth,
        windowHeight,
        keyControl,
        setKeyControl,
        setNextPage,
        interactiveElements,
        gameService
           }: PropsWithChildren<PageProps>) => {
  const enum Animations { INTRO, OUTRO, END}


  //other
  const textureRobot = useMemo(() => loadTexture(robot), []);
  const fill = "#054388";
  const stroke = "#009CDD";
  const explText = t`Deselect the right options to restore a balance between privacy and comfort. Different decisions will have different affects on your scores.`

  //state
  const [animating, setAnimating] = useState(false);
  const [animation, setAnimation] = useState(Animations.INTRO);
  const [showExpl, setShowExpl] = useState(false);
  const [pixiTexts, setPixiTexts] = useState<PixiText[]>([]);

  //refs
  const graphicRef = useRef<PixiContainer | null>(null);
  const textRef = useRef<PixiContainer | null>(null);
  const robotRef = useRef<PixiSprite | null >(null);
  const backgroundRef = useRef<PixiContainer | null>(null);

  //hooks
  const {ePressed} = useCharacterControls();
  const pos = useCharacterPosition();
  const mgrRef = useAnimationManager();

  useEffect(() => {
    if (showExpl) {
      setupTexts();
      setupGraphics();
      setupBg();
      setAnimation(Animations.INTRO);
    }
  }, [showExpl]);

  const ready =
          showExpl &&
          !!mgrRef.current &&
          !!robotRef.current &&
          !!textRef.current &&
          !!graphicRef.current;


  //hide explanations  on init
  useLayoutEffect(() => {
    const text = textRef.current;
    const graphic = graphicRef.current;
    if (!text || !graphic)return;
    toggleExplanations([text, graphic], false);
  }, []);

  //manageAnimations
  useEffect(() => {

    if (animation === Animations.END) {
      setKeyControl(Pages.MAIN);
      setNextPage(PageOrder.SCORE_CHANGES);
      return;
    }

    let timeoutId: number | undefined;

    const mgr = mgrRef.current!;
    const robot = robotRef.current;
    const texts = textRef.current;
    const graphics = graphicRef.current;
    if (!robot || !mgr || !texts ||  !graphics || !ready) return;

    const run = async () => {

      switch (animation) {
        case Animations.INTRO: {
          const growChar = {
            startX: windowWidth * 0.825, startY: windowHeight * 0.725,
            endX: windowWidth * 0.85, endY: windowHeight * 0.7,
            startS: 0.6, endS: 0.8, showOthers: false, duration: 750
          } as GrowProps

          setAnimating(true);
          toggleExplanations([texts, graphics], true);
          await mgr.parallel([() => growAnimation(mgr, robot, growChar),
            () => fadeAnimation(mgr, [texts, graphics], FADE_IN)]);
          setAnimating(false);
          break;
        }

        case Animations.OUTRO:
          setAnimating(true);
          await mgr.parallel([() => fadeAnimation(mgr, [texts, graphics, robot], FADE_OUT)]);
          setAnimation(Animations.END);
          setAnimating(false);
          setShowExpl(false);
          toggleExplanations([texts, graphics], false);
          gameService?.enableSmartDevices();
          break;
      }
    };

    run();

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [ready, animation]);

  useEffect(() => {
    if(keyControl != Pages.More_Expl_SD || animating)return;

    const onSpecialPressed = (e: globalThis.KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          //setAnimation(Animations.OUTRO);
          break;
      }
    }

    const events = [onSpecialPressed];

    events.forEach(func => window.addEventListener("keydown", func));
    return () => {
      events.forEach(func => window.removeEventListener("keydown", func));
    };
  }, [keyControl, animating]);


  //smartDeviceDetection
  const checkFoundSmartTV = (): boolean => {
    if (!pos || !interactiveElements?.length) return false;

    const targetX = pos.x / TILE_SIZE;
    const targetY = pos.y / TILE_SIZE;

    const interactiveElement = interactiveElements.find((element) => {
      const elementLeft = element.x - 1;
      const elementRight = element.x + element.width;
      const elementTop = element.y - 1;
      const elementBottom = element.y + element.height;
      return (
              targetX >= elementLeft &&
              targetX <= elementRight &&
              targetY >= elementTop &&
              targetY <= elementBottom
      );
    });

    if (interactiveElement?.x === 4 && interactiveElement.y === 2) {
      interactiveElement.interaction();
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (ePressed && checkFoundSmartTV()){
      setShowExpl(true);
      gameService?.disableSmartDevices();
    }
  }, [ePressed]);

  //listen for smartTvDone
  useEffect(() => {
    if (!gameService)return;
    const devices = gameService.getDeviceForRoom("livingroom");
    const tv = devices.find(d => d.name === "SmartTv");

    if (!tv) return;

    const unsubscribe = tv.subscribe(device => {
      if (device.getIsCompleted()) {
        setAnimation(Animations.OUTRO);
      }
    });

    return () => unsubscribe();
  }, []);

  //setup graphics
  const setupTexts = () => {
    const t1 = new PixiText();
    t1.text = explText;
    t1.x = windowWidth*0.875;
    t1.y = windowHeight*0.35;
    t1.style = new TextStyle({
      fontSize: Math.min(windowWidth, windowHeight) * 0.035,
      fontWeight: "normal",
      wordWrapWidth: windowWidth * 0.22
    })

    setPixiTexts(prev => [...prev, t1]);

  }
  const setupGraphics = () => {

    const g = new PixiGraphics();
    g.clear();
    g.beginFill(fill, 1);
    g.lineStyle(3, stroke);
    g.drawRoundedRect(windowWidth*0.76, windowHeight*0.2, windowWidth*0.225, windowHeight*0.3, 10);
    g.endFill();

    const parent = graphicRef?.current;
    if (!parent) return;

    parent.addChild(g);
  }

  const setupBg = () => {
    const bg = new PixiGraphics();

    bg.clear();
    bg.alpha = 0.7;
    bg.beginFill(0x000000);
    bg.drawRect(0, 0, windowWidth, windowHeight);
    bg.endFill();

    const parent = backgroundRef.current;
    if (!parent)return;
    parent.addChild(bg);
  }


  const graphics = () => {
    if (!showExpl)return null;
    return (<Container ref={graphicRef} renderable={false} alpha={0}/>)
  }


  const background = () => {
    if (!showExpl)return null;

    return (
              <Container ref={backgroundRef}/>
    )
  }

  const texts = () => {
    if (!showExpl)return null;
    return (
            <Container ref={textRef} renderable={false}>
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
            {graphics()}
            {texts()}
            {showExpl && textureRobot && <Sprite
                    texture={textureRobot}
                    ref={robotRef}
            />}
          </>
  )
};