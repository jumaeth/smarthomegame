import React, {
  KeyboardEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {Container, Graphics, Sprite, Text} from "@pixi/react";
import characterImage from "@/assets/tutorial/characterPage/cp_character.png";
import arrowKeys from "@/assets/tutorial/characterPage/cp_arrow_keys.png";
import eKey from "@/assets/tutorial/characterPage/cp_e_key.png";
import highlighting from "@/assets/tutorial/characterPage/cp_highlight.png";
import {loadTexture} from "@/utils/loadTexture.ts";
import {Container as PixiContainer, Graphics as PixiGraphics, Sprite as PixiSprite, TextStyle} from "pixi.js";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {Texture} from "@pixi/core";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {ImageProps, TextProps} from "@/pixi/components/Tutorial/util/Types.ts";
import {fadeAnimation} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {useAnimationManager} from "@/hooks/tutorial/useAnimationManager.tsx";
import {growAnimation} from "@/pixi/components/Tutorial/anim/growAnimation.ts";
import {FADE_IN, FADE_OUT} from "@/pixi/components/Tutorial/util/AnimProps.ts";
import {toggleExplanations} from "@/pixi/components/Tutorial/util/drawings.tsx";
import {PageOrder} from "@/pixi/components/Tutorial/Tutorial.tsx";
import {GROW_DURATION} from "@/pixi/components/Tutorial/util/Constants.ts";

export const CharacterPage: React.FC<PageProps> = ({
       windowWidth,
       windowHeight,
       keyControl,
       setKeyControl,
       setNextPage
           }: PropsWithChildren<PageProps>) => {

  type animProps = {
    startX: number,
    startY: number,
    startS: number,

    endX: number,
    endY: number,
    endS: number,

    showOthers: boolean
    duration: number
  }

  type SpriteData = {
    x: number, y: number, texture: Texture, scale: number, anchor: number
  }

  const enum Animations {GROW, SHRINK, END}

  //states
  const [onLoad, setOnLoad] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [showChar, setShowChar] = useState(true);
  const [animation, setAnimation] = useState(Animations.GROW);
  const [allTexts, setAllTexts] = useState<TextProps[]>([]);
  const [allImages, setAllImages] = useState<ImageProps[]>([]);

  //refs
  const textRef = useRef<PixiContainer|null>(null);
  const imageRef = useRef<PixiContainer|null>(null);
  const charRef = useRef<PixiSprite | null >(null);
  const graphicRef = useRef<PixiContainer|null>(null);

  //others
  const textsTemp = [
          "Movement", "Use the arrow keys or WASD to move around", "Interaction", 'Use the “E” key to interact with objects',
          "Discovery", "Interactive objects light up if you walk next to them", "The Player"
  ]
  const texture = useMemo(() => loadTexture(characterImage), []);
  const imageSource: arrowKeys = [arrowKeys, eKey, highlighting];

  //hooks
  const mgrRef = useAnimationManager();

  //init
  useEffect(() => {
    if (onLoad) {
      setupTexts();
      setupImages();
      setOnLoad(false);
    }
  }, [onLoad]);

  //hide explanations  on init
  useLayoutEffect(() => {
    toggleExplanations([textRef.current, imageRef.current, graphicRef.current], false);
  }, []);

  //keyControls
  useEffect(() => {
    if(keyControl != Pages.CHARACTER || animating)return;

    const onSpecialPressed = (e: KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          setAnimation(Animations.SHRINK);
      }
    }

    const events = [onSpecialPressed];

    events.forEach(func => window.addEventListener("keydown", func));
    return () => {
      events.forEach(func => window.removeEventListener("keydown", func));
    };
  }, [keyControl, animating]);

  //manage animations
  useEffect(() => {
    let timeoutId: number | undefined;
    let cancelled = false;

    const mgr = mgrRef.current!;
    const sprite = charRef.current;
    const texts = textRef.current;
    const images = imageRef.current;
    const graphics = graphicRef.current;
    if (!sprite || !mgr || !texts || !images || !graphics) return;

    const run = async () => {
      switch (animation) {

        case Animations.GROW:
          const growChar = {
            startX: windowWidth / 2 + TILE_SIZE * 4, startY: windowHeight / 2 + TILE_SIZE * 5.9,
            endX: windowWidth * 0.5 + TILE_SIZE * 3, endY: windowHeight * 0.5,
            startS: 5, endS: 17, showOthers: true, duration: GROW_DURATION
          } as animProps

          setAnimating(true);
          await mgr.sequence([() => growAnimation(mgr, sprite, growChar)]);
          toggleExplanations([texts, images, graphics], true);
          await mgr.parallel([() => fadeAnimation(mgr, [texts, images, graphics], FADE_IN)]);
          setAnimating(false);
          break;

        case Animations.SHRINK:
          const shrinkChar = {
            startX: windowWidth * 0.5 + TILE_SIZE * 3, startY: windowHeight * 0.5,
            endX: windowWidth / 2 + TILE_SIZE * 4, endY: windowHeight / 2 + TILE_SIZE * 5.9,
            startS: 17, endS: 5, showOthers: false, duration: GROW_DURATION
          } as animProps
          setAnimating(true);
          await mgr.parallel([
                  () => fadeAnimation(mgr, [texts, images, graphics], FADE_OUT),
                  () => growAnimation(mgr, sprite, shrinkChar)])
          setAnimating(false);
          toggleExplanations([texts, images, graphics], false);
          setAnimation(Animations.END)
          break;

        case Animations.END:
          setKeyControl(Pages.MAIN);
          setNextPage(PageOrder.SCORES);
          setAnimating(true);
          setShowChar(false);
          break;
      }
    }

    run();
    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [animation]);


  //setup graphics
  const setupLines =  useCallback( (g: PixiGraphics) => {
    g.clear();

    //top left
    g.lineStyle(7, "FFFFFF", 1);
    g.moveTo(windowWidth*0.27, windowHeight*0.25);
    g.bezierCurveTo(windowWidth*0.37, windowHeight*0.25, windowWidth*0.37, windowHeight*0.45, windowWidth*0.445, windowHeight*0.45);

    //bottom
    g.lineStyle(6, "FFFFFF", 1);
    g.moveTo(windowWidth*0.31, windowHeight*0.77);
    g.bezierCurveTo(windowWidth*0.33, windowHeight*0.67, windowWidth*0.43, windowHeight*0.72, windowWidth*0.455, windowHeight*0.67);

    //top right
    g.lineStyle(6, "FFFFFF", 1);
    g.moveTo(windowWidth*0.7, windowHeight*0.3);
    g.bezierCurveTo(windowWidth*0.66, windowHeight*0.32, windowWidth*0.65, windowHeight*0.5, windowWidth*0.6, windowHeight*0.5);
  }, [])
  const setupTexts = () => {
    setAllTexts(prev => [
      ...prev,
      { text: textsTemp[0], x: windowWidth*0.2,   y: windowHeight*0.29,  fontSize: 0.04, fontWeight: "bold"   },
      { text: textsTemp[2], x: windowWidth*0.225, y: windowHeight*0.79,  fontSize: 0.04, fontWeight: "bold"   },
      { text: textsTemp[4], x: windowWidth*0.8,   y: windowHeight*0.45,  fontSize: 0.04, fontWeight: "bold"   },
      { text: textsTemp[1], x: windowWidth*0.2,   y: windowHeight*0.35,  fontSize: 0.03, fontWeight: "lighter"},
      { text: textsTemp[3], x: windowWidth*0.225, y: windowHeight*0.85,  fontSize: 0.03, fontWeight: "lighter"},
      { text: textsTemp[5], x: windowWidth*0.8,   y: windowHeight*0.525, fontSize: 0.03, fontWeight: "lighter"},
      { text: textsTemp[6], x: windowWidth*0.5+TILE_SIZE*3, y: windowHeight*0.25, fontSize: 0.07, fontWeight: "bold" },
    ]);
  };

  const setupImages = () => {
    setAllImages(prev => [
      ...prev,
      { texture: loadTexture(imageSource[0]), x: windowWidth*0.2,   y: windowHeight*0.18,  scale: 1.15},
      { texture: loadTexture(imageSource[1]), x: windowWidth*0.225, y: windowHeight*0.7,  scale: 1},
      { texture: loadTexture(imageSource[2]), x: windowWidth*0.8,   y: windowHeight*0.29,  scale: 1},
    ]);


  }

  const lines = () => {
    return (
            <Container ref={graphicRef}>
              <Graphics draw={setupLines}/>
            </Container>
    )
  }

  const texts = () => {
    return (
            <Container ref={textRef}>
              {allTexts.map((text, i) => (
                      <Text
                              key={i}
                              text={text.text}
                              x={text.x}
                              y={text.y}
                              anchor={0.5}
                              style={new TextStyle({
                                fontFamily: "LoResRegular",
                                fontSize: Math.min(windowWidth, windowHeight)*text.fontSize,
                                fontWeight: text.fontWeight,
                                fill: "#FFFFFF",
                                align: "center",
                                wordWrap: true,
                                wordWrapWidth: windowWidth * 0.2,
                              })
                              }
                      />
              ))}
            </Container>
    )
  }

  const images = () => {
    return (
            <Container ref={imageRef}>
              {allImages.map((i, k) => (
                <Sprite
                        key={k}
                        texture={i.texture}
                        x={i.x}
                        y={i.y}
                        anchor={0.5}
                        scale={i.scale}
                />
              ))}
            </Container>
    )
  }


  return (
      <>
        {showChar && texture && <Sprite
          texture={texture}
          ref={charRef}
        />}
        {lines()}
        {texts()}
        {images()}
      </>
  )
};