import React, {KeyboardEvent, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Container, Graphics, Sprite, Text} from "@pixi/react";
import characterImage from "@/assets/tutorial/characterPage/cp_character.png";
import arrowKeys from "@/assets/tutorial/characterPage/cp_arrow_keys.png";
import eKey from "@/assets/tutorial/characterPage/cp_e_key.png";
import highlighting from "@/assets/tutorial/characterPage/cp_highlight.png";
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
import {Texture} from "@pixi/core";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";

export const CharacterPage: React.FC<PageProps> = ({
       windowWidth,
       windowHeight,
       keyControl,
       setKeyControl,
       setSpotLightAnimation
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

  const texture = useMemo(() => loadTexture(characterImage), []);
  const charRef = useRef<PixiSprite | null >(null);
  const [animation, setAnimation] = useState(1);
  const [showExpl, setShowExpl] = useState(false);
  const [pixiTexts, setPixiTexts] = useState([]);
  const conRef = useRef<PixiContainer|null>(null);
  const [onLoad, setOnLoad] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [showChar, setShowChar] = useState(true);


  const textsTemp = [
          "Movement", "Use the arrow keys or WASD to move around", "Interaction", 'Use the “E” key to interact with objects',
          "Discovery", "Interactive objects light up if you walk next to them", "The Player"
  ]

  const imageSource: arrowKeys = [arrowKeys, eKey, highlighting];
  const [pixiImages, setPixiImages] = useState<SpriteData[]>([])

  useEffect(() => {
    if (onLoad) {
      drawTexts();
      drawImages();
      setOnLoad(false);
    }
  }, [onLoad]);


  //keyControls
  useEffect(() => {
    if(keyControl != Pages.Character || animating)return;

    const onSpecialPressed = (e: KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          setAnimation(2);
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
    const sprite = charRef.current;
    if (!sprite) return;

    switch (animation){
      case 1:
        const anim1 = {
          startX: windowWidth/2+TILE_SIZE*4, startY: windowHeight/2+TILE_SIZE*5.9,
          endX: windowWidth*0.5+TILE_SIZE*3, endY: windowHeight * 0.5,
          startS: 5, endS: 17, showOthers: true, duration: 750
        } as animProps
        growAnimation(sprite, anim1, 0);
        break;
      case 2:
        const anim2 = {
          startX: windowWidth*0.5+TILE_SIZE*3, startY: windowHeight * 0.5,
          endX: windowWidth/2+TILE_SIZE*4, endY: windowHeight/2+TILE_SIZE*5.9,
          startS: 17, endS: 5, showOthers: false, duration: 750
        } as animProps
        growAnimation(sprite, anim2, 3);
        break;
      case 3:
        setKeyControl(Pages.Main);
        setSpotLightAnimation(2);
        setAnimating(true);
        setShowChar(false);
        break;
    }
  }, [animation]);

  const drawLines =  useCallback( (g: PixiGraphics) => {
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

  const setupTexts = (text: string, x: number, y: number, fontSize: number, fontWeight: TextStyleFontWeight) => {
    const t1 = new PixiText();
    t1.text = text;
    t1.x = x;
    t1.y = y;
    t1.style = new TextStyle({
      fontSize: Math.min(windowWidth, windowHeight) * fontSize,
      fontWeight: fontWeight
    })

    setPixiTexts(prev => [...prev, t1]);

  }

  const drawTexts = () => {

    const c = new PixiContainer();

    setupTexts(textsTemp[0], windowWidth*0.2, windowHeight*0.29, 0.04, "bold");
    setupTexts(textsTemp[2], windowWidth*0.225, windowHeight*0.79, 0.04, "bold");
    setupTexts(textsTemp[4], windowWidth*0.8, windowHeight*0.45, 0.04, "bold");
    setupTexts(textsTemp[1], windowWidth*0.2, windowHeight*0.35, 0.03, "lighter");
    setupTexts(textsTemp[3], windowWidth*0.225, windowHeight*0.85, 0.03, "lighter");
    setupTexts(textsTemp[5], windowWidth*0.8, windowHeight*0.525, 0.03, "lighter");

    setupTexts(textsTemp[6], windowWidth*0.5+TILE_SIZE*3, windowHeight*0.25, 0.07, "bold");

    pixiTexts.forEach(t => c.addChild(t));
    c.width = windowWidth;
    c.height = windowHeight;
    c.x = 0;
    c.y = 0;
    conRef.current = c;
  }

  const setupImages = (texture: number, x: number, y: number, scale: number) => {
    const image: SpriteData = {
      x: x,
      y: y,
      texture: loadTexture(imageSource[texture]),
      scale: scale,
      anchor: 0.5
    }

    setPixiImages( prev => [...prev, image]);
  }

  const drawImages = () => {
    setupImages(0, windowWidth * 0.2, windowHeight * 0.18, 1.15);
    setupImages(1, windowWidth * 0.225, windowHeight * 0.7, 1);
    setupImages(2, windowWidth * 0.8, windowHeight * 0.29, 1);
  }

  const lines = () => {
    return (<Graphics draw={drawLines}/>)
  }

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
                                align: "center",
                                wordWrap: true,
                                wordWrapWidth: windowWidth * 0.2
                              })
                              }
                      />
              ))}
            </Container>
    )
  }

  const images = () => {
    return (
            <Container>
              {pixiImages.map((i, k) => (
                <Sprite
                        key={k}
                        texture={i.texture}
                        x={i.x}
                        y={i.y}
                        anchor={i.anchor}
                        scale={i.scale}
                />
              ))}
            </Container>
    )
  }
  const growAnimation = (sprite: PixiSprite, props: animProps, next: number) => {

    if (!sprite) return;
    setAnimating(true);

    let rafId = 0;
    const startTime = performance.now();
    const duration = props.duration;


    sprite.anchor.set(0.5,0.5);
    sprite.x = props.startX;
    sprite.y = props.startY;
    sprite.scale.x = props.startS;
    sprite.scale.y = props.startS;

    const endX = props.endX;
    const endY = props.endY;
    const endS = props.endS;

    if(!props.showOthers) {
      setShowExpl(false);
    }


    const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

    const tick = (now: number) => {
      const p = Math.min(1, (now - startTime) / duration);

      if (charRef.current != null && charRef.current instanceof PixiSprite) {

        sprite.scale.set(lerp(props.startS, endS, p));
        sprite.position.set(lerp(props.startX, endX, p), lerp(props.startY, endY, p));

        if (p < 1) {
          rafId = requestAnimationFrame(tick);
        }else {
          setAnimation(next);
          if(props.showOthers) {
            setShowExpl(true);
          }
          setAnimating(false);
        }
      }

    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
    }
  }

  return (
      <>
        {showChar && texture && <Sprite
          texture={texture}
          ref={charRef}
        />}
        {showExpl && lines()}
        {showExpl && texts()}
        {showExpl && images()}
      </>
  )
};