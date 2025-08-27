import React, {KeyboardEvent, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics, Sprite, Text, useTick} from "@pixi/react";
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
import {growAnimation, GrowProps} from "@/pixi/components/Tutorial/anim/growTween.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {useCharacterControls} from "@/hooks/character/useCharacterControls.ts";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {useCharacterPosition} from "@/hooks/character/useCharacterPosition.ts";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {fadeAnimation, FadeProps} from "@/pixi/components/Tutorial/anim/fadeTween.ts";
import robot from "@/assets/tutorial/explainTVPage/pointing.png";



export const More_Expl_SD: React.FC<PageProps> = ({
        windowWidth,
        windowHeight,
        keyControl,
        setKeyControl,
        setNextPage,
        interactiveElements,
        gameService
           }: PropsWithChildren<PageProps>) => {

  const textureRobot = useMemo(() => loadTexture(robot), []);
  const [onLoad, setOnLoad] = useState(true);
  const {ePressed} = useCharacterControls();
  const pos = useCharacterPosition();
  const mgrRef = useRef<AnimationManager | null>(null);
  const graphicRef = useRef<PixiContainer | null>(null);
  const textRef = useRef<PixiContainer | null>(null);
  const [animating, setAnimating] = useState(false);
  const [animation, setAnimation] = useState(0);
  const [showExpl, setShowExpl] = useState(false);
  const robotRef = useRef<PixiSprite | null >(null);
  const [pixiTexts, setPixiTexts] = useState([]);
  const backgroundRef = useRef<PixiContainer | null>(null);
  const fill = "#054388";
  const stroke = "#009CDD";
  const explText = "Deselect the right options to restore a balance between privacy and comfort." +
          " Different decisions will have different affects on your scores."



  //----------init----------

  //init graphics/texts
  useEffect(() => {
    if (onLoad) {
      setOnLoad(false);
    }
  }, [onLoad]);

  useEffect(() => {
    mgrRef.current = new AnimationManager();
    return () => mgrRef.current?.cancelAll();
  }, []);

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
            startX:  windowWidth*0.9, startY: windowHeight*0.9,
            endX: windowWidth * 0.8, endY: windowHeight * 0.7,
            startS: 0.5, endS: 0.8, showOthers: false, duration: 750
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
          setShowExpl(false);
          setAnimating(false);
          setAnimation(0);
          gameService?.resumeGame();
          break;

        case 3:
          setKeyControl(Pages.MAIN);
          setNextPage(8);
          break;
      }
    };

    run();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [animation]);

  useEffect(() => {
    const devices = gameService?.getDeviceForRoom("livingroom");
    if (!devices)return;
    const smartTV = devices?.find(d => d.name === "SmartTv");
  }, []);

  useEffect(() => {
    if(keyControl != Pages.More_Expl_SD || animating)return;

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

  const setupTexts = () => {
    const t1 = new PixiText();
    t1.text = explText;
    t1.x = windowWidth*0.825;
    t1.y = windowHeight*0.35;
    t1.style = new TextStyle({
      fontSize: Math.min(windowWidth, windowHeight) * 0.035,
      fontWeight: "normal",
      wordWrapWidth: windowWidth * 0.25
    })

    setPixiTexts(prev => [...prev, t1]);

  }
  const setupGraphics = () => {

    const g = new PixiGraphics();
    g.clear();
    g.beginFill(fill, 1);
    g.lineStyle(3, stroke);
    g.drawRoundedRect(windowWidth*0.7, windowHeight*0.2, windowWidth*0.25, windowHeight*0.3, 10);
    g.endFill();

    const parent = graphicRef?.current;
    if (!parent) return;

    parent.addChild(g);
  }

  const checkFoundSmartTV = (): boolean => {
    if (!pos) {
      return;
    }

    const targetX = pos.x / TILE_SIZE;
    const targetY = pos.y / TILE_SIZE;

    const interactiveElement: InteractivePixiElement = interactiveElements?.find(element => {
      const elementLeft = element.x-1;
      const elementRight = element.x + (element.width ) ;
      const elementTop = element.y-1;
      const elementBottom = element.y + (element.height) ;
      return (
              targetX >= elementLeft &&
              targetX <= elementRight &&
              targetY >= elementTop &&
              targetY <= elementBottom
      );
    });

    if (interactiveElement && interactiveElement.x === 4 && interactiveElement.y === 2) {
      interactiveElement.interaction();
      return true;
    }else{
      return false;
    }
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

  useEffect(() => {
    if (ePressed && checkFoundSmartTV()){
      setShowExpl(true);
      gameService?.pauseGame();
    }
  }, [ePressed]);

  useEffect(() => {
    if (showExpl) {
      setupTexts();
      setupGraphics();
      setupBg();
      setAnimation(1);
    }
  }, [showExpl]);

  const graphics = () => {
    if (!showExpl)return null;
    return (<Container ref={graphicRef}/>)
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
            {graphics()}
            {texts()}
            {showExpl && textureRobot && <Sprite
                    texture={textureRobot}
                    ref={robotRef}
            />}
          </>
  )
};