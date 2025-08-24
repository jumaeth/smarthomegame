import React, {KeyboardEvent, PropsWithChildren, useEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics, Sprite, Text} from "@pixi/react";
import scoresImage from "@/assets/tutorial/scoresPage/scores.png";
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
import {growAnimation, GrowProps} from "@/pixi/components/Tutorial/anim/growTween.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {Simulate} from "react-dom/test-utils";
import {characterPositionStore} from "@/utils/characterPosition.ts";


export const More_Expl: React.FC<PageProps> = ({
       windowWidth,
       windowHeight,
       keyControl,
       setKeyControl,
       setNextPage
           }: PropsWithChildren<PageProps>) => {

  const texture = useMemo(() => loadTexture(scoresImage), []);
  const charRef = useRef<PixiSprite | null >(null);
  const [animation, setAnimation] = useState(1);
  const [showExpl, setShowExpl] = useState(false);
  const [pixiTexts, setPixiTexts] = useState([]);
  const conRef = useRef<PixiContainer|null>(null);
  const [onLoad, setOnLoad] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [showChar, setShowChar] = useState(true);
  const mgrRef = useRef<AnimationManager | null>(null);
  const backgroundRef = useRef<PixiGraphics | null>(null);



  const textsTemp = [
          "Your first task is to find the smartTV. Look out for some red pixels!" +
          " It can be found somewhere in the living room. Remember: You can move using WASD or the arrow keys and the" +
          " smart device will light up once you are close."
  ]

  //----------init----------

  //init graphics/texts
  useEffect(() => {
    if (onLoad) {
      drawTexts();
      setOnLoad(false);
    }
  }, [onLoad]);



  //----------animations----------

  //cleanup animations
  useEffect(() => {
    mgrRef.current = new AnimationManager();
    return () => mgrRef.current?.cancelAll();
  }, []);

  //run grow/shrink animation
  const runGrowAnimation = async (sprite: PixiSprite, growProps: GrowProps) => {
    const mgr = mgrRef.current!;

    await mgr.sequence([
      () => growAnimation(mgr, sprite, growProps),
    ]);
  };

  //manage animations
  useEffect(() => {
    if (!mgrRef.current) return;

    let timeoutId: number | undefined;
    let cancelled = false;
    const sprite = charRef.current;
    if (!sprite) return;

    const run = async () => {
      switch (animation) {
        case 1:
          teleport();
          setKeyControl(Pages.MAIN);
          setNextPage(7);
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
    if(keyControl != Pages.MORE_EXPL || animating)return;

    const onSpecialPressed = (e: KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          teleport();
          break;
        case "b":
          setKeyControl(Pages.MAIN);
          setNextPage(7);
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
  const setupTexts = (text: string, x: number, y: number, fontSize: number, fontWeight: TextStyleFontWeight, wrap: number) => {
    const t1 = new PixiText();
    t1.text = text;
    t1.x = x;
    t1.y = y;
    t1.style = new TextStyle({
      fontSize: Math.min(windowWidth, windowHeight) * fontSize,
      fontWeight: fontWeight,
      wordWrapWidth: windowWidth * wrap
    })

    setPixiTexts(prev => [...prev, t1]);

  }

  //define text properties
  const drawTexts = () => {

    const c = new PixiContainer();

    setupTexts(textsTemp[0], windowWidth*0.2, windowHeight*0.6, 0.04, "bold", 0.3);
    setupTexts(textsTemp[2], windowWidth*0.67, windowHeight*0.625, 0.04, "bold", 0.3);

    setupTexts(textsTemp[1], windowWidth*0.2525, windowHeight*0.71, 0.03, "lighter", 0.3);
    setupTexts(textsTemp[3], windowWidth*0.7425, windowHeight*0.73, 0.03, "lighter", 0.36);

    setupTexts(textsTemp[4], windowWidth*0.55+TILE_SIZE*3, windowHeight*0.1, 0.07, "bold", 0.3);

    pixiTexts.forEach(t => c.addChild(t));
    c.width = windowWidth;
    c.height = windowHeight;
    c.x = 0;
    c.y = 0;
    conRef.current = c;
  }

  const drawSpotlight = () => {
    const g = backgroundRef.current;
    if (!g) return;

    g.clear();
    g.alpha = 0.7;
    g.beginFill(0x000000);
    g.drawRect(0, 0, windowWidth, windowHeight);
    g.beginHole();
    g.drawRoundedRect(windowWidth*0.1, windowHeight*0.05, windowWidth*0.1, windowWidth*0.1, 10);
    g.endHole();
    g.endFill();
  }

  const drawBackground = ()=> {
    const g = backgroundRef.current;

    if (!g) return;

    g.clear();
    g.alpha = 0.7;
    g.beginFill(0x000000);
    g.drawRect(0, 0, windowWidth, windowHeight);
    g.endFill();
  }

  const background = () => {
    return (
            <>
              <Graphics ref={backgroundRef} />
            </>
    )
  }

  //translate texts to react
  const texts = () => {
    return (
            <Container>
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
        {showChar && texture && <Sprite
          texture={texture}
          ref={charRef}
        />}
      </>
  )
};