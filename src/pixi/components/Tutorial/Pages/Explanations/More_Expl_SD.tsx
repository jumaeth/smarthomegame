import React, {PropsWithChildren, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
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
import {PageOrder} from "@/pixi/components/Tutorial/util/PageOrder.ts";
import {t} from "@lingui/core/macro";


export const More_Expl_SD: React.FC<PageProps> = ({
        windowWidth,
        windowHeight,
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
  const [pixiTexts, setPixiText] = useState<PixiText>();
  const [introRun, setIntroRun] = useState(false);


  //refs
  const graphicRef = useRef<PixiContainer | null>(null);
  const textRef = useRef<PixiContainer | null>(null);
  const robotRef = useRef<PixiSprite | null >(null);
  const backgroundRef = useRef<PixiContainer | null>(null);

  //hooks
  const {ePressed} = useCharacterControls();
  const pos = useCharacterPosition();
  const mgrRef = useAnimationManager();

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
  }, [])

  const growChar = useMemo<GrowProps>(() =>  {
    return {
    startX: windowWidth * 0.825, startY: windowHeight * 0.725,
    endX: windowWidth * 0.9, endY: windowHeight * 0.7,
    startS: Math.min(windowWidth, windowHeight) / 4000, endS: Math.min(windowWidth, windowHeight) / 1000,
    duration: 750
    }
  }, [windowWidth, windowHeight])


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
          if (introRun)return
          setAnimating(true);
          toggleExplanations([texts, graphics], true);
          await mgr.parallel([() => growAnimation(mgr, robot, growChar),
            () => fadeAnimation(mgr, [texts, graphics], FADE_IN)]);
          setAnimating(false);
          setIntroRun(true)
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
  }, [ready, animation, Animations.INTRO, Animations.OUTRO, Animations.END,
    gameService, mgrRef, setKeyControl, setNextPage, introRun, growChar]);

  useEffect(() => {
    const sprite = robotRef.current
    if(!sprite || animating)return;
    sprite.x = growChar.endX
    sprite.y = growChar.endY
    sprite.scale.set(growChar.endS)
  }, [windowWidth, windowHeight, growChar.endS, growChar.endY, growChar.endX, animating]);

  //smartDeviceDetection
  const checkFoundSmartTV = useCallback( (): boolean => {
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
  },[interactiveElements, pos])

  useEffect(() => {
    if (ePressed && checkFoundSmartTV()){
      setShowExpl(true);
      gameService?.disableSmartDevices();
    }
  }, [ePressed, checkFoundSmartTV, gameService]);

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
  }, [Animations.OUTRO, gameService]);

  //setup graphics
  const setupTexts = useCallback(() => {
    const t1 = new PixiText();
    t1.text = explText;
    t1.x = windowWidth*0.875;
    t1.y = windowHeight*0.35;
    t1.style = new TextStyle({
      fontSize: Math.min(windowWidth, windowHeight) * 0.035,
      fontWeight: "normal",
      wordWrapWidth: windowWidth * 0.22
    })

    setPixiText(t1);

  },[windowWidth, windowHeight, explText])
  const setupGraphics = useCallback(() => {

    const g = new PixiGraphics();
    g.clear();
    g.beginFill(fill, 1);
    g.lineStyle(3, stroke);
    g.drawRoundedRect(windowWidth*0.76, windowHeight*0.2, windowWidth*0.225, windowHeight*0.3, 10);
    g.endFill();

    const parent = graphicRef?.current;
    if (!parent) return;

    parent.children.filter(c => c instanceof PixiGraphics).forEach(c => parent.removeChild(c))
    parent.addChild(g);
  },[windowWidth, windowHeight])

  const setupBg = useCallback(() => {
    const bg = new PixiGraphics();

    bg.clear();
    bg.alpha = 0.7;
    bg.beginFill(0x000000);
    bg.drawRect(0, 0, windowWidth, windowHeight);
    bg.endFill();

    const parent = backgroundRef.current;
    if (!parent)return;
    parent.addChild(bg);
  },[windowWidth, windowHeight])

  useEffect(() => {
    if (showExpl) {
      setupTexts();
      setupGraphics();
      setupBg();
      setAnimation(Animations.INTRO);
    }
  }, [showExpl, Animations.INTRO, setupBg, setupGraphics, setupTexts]);

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
              {pixiTexts && <Text
                      key={pixiTexts?.text}
                      text={pixiTexts.text}
                      x={pixiTexts.x}
                      y={pixiTexts.y}
                      anchor={0.5}
                      style={new TextStyle({
                        fontFamily: "LoResRegular",
                        fontSize: pixiTexts.style.fontSize,
                        fontWeight: pixiTexts.style.fontWeight,
                        fill: "#FFFFFF",
                        align: "left",
                        wordWrap: true,
                        wordWrapWidth: pixiTexts.style.wordWrapWidth
                      })
                      }
              />}
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