import React, {PropsWithChildren, RefObject, useEffect, useMemo, useRef, useState} from "react";
import {Container, Sprite} from "@pixi/react";
import handsUp from "@/assets/tutorial/explanationPages/handsUp.png";
import pointLeft from "@/assets/tutorial/explanationPages/pointLeft.png";
import leftKey from "@/assets/tutorial/explanationPages/leftKey.png";
import rightKey from "@/assets/tutorial/explanationPages/rightKey.png";
import {loadTexture} from "@/utils/loadTexture.ts";
import {
  Container as PixiContainer,
  Graphics as PixiGraphics,
  Sprite as PixiSprite,
  Text as PixiText,
  TextStyle,
  TextStyleAlign,
  TextStyleFontWeight
} from "pixi.js";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {growAnimation, GrowProps} from "@/pixi/components/Tutorial/anim/growAnimation.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {fadeAnimation, FadeProps} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import '@pixi/events';
import {FADE_IN, FADE_OUT} from "@/pixi/components/Tutorial/util/AnimProps.ts";
import {PageOrder} from "@/pixi/components/Tutorial/Tutorial.tsx";
import {useAnimationManager} from "@/hooks/tutorial/useAnimationManager.tsx";
import {t} from "@lingui/core/macro";

export const Decision: React.FC<PageProps> = ({
       windowWidth,
       windowHeight,
       keyControl,
       setKeyControl,
       setNextPage
           }: PropsWithChildren<PageProps>) => {

  enum Anims {IDLE, INTRO, SWITCH, OUTRO_LESS,OUTRO_MORE}
  const textureHandsUp = useMemo(() => loadTexture(handsUp), []);
  const texturePointLeft = useMemo(() => loadTexture(pointLeft), []);
  const textureLeftArr = useMemo(() => loadTexture(leftKey), []);
  const textureRightArr = useMemo(() => loadTexture(rightKey), []);
  const leftArrRef = useRef<PixiSprite | null>(null);
  const rightArrRef = useRef<PixiSprite | null>(null);
  const charRef = useRef<PixiSprite | null >(null);
  const [animation, setAnimation] = useState(Anims.IDLE);
  const [showExpl, setShowExpl] = useState(false);
  const [onLoad, setOnLoad] = useState(true);
  const [animating, setAnimating] = useState(false);
  const mgrRef = useAnimationManager();
  const spriteContainerRef = useRef(null)
  const midTextRef = useRef<PixiContainer | null>(null);
  const leftTextRef = useRef<PixiContainer | null>(null);
  const rightTextRef = useRef<PixiContainer | null>(null);
  const midContRef = useRef<PixiContainer | null>(null);
  const leftContRef = useRef<PixiContainer | null>(null);
  const rightContRef = useRef<PixiContainer | null>(null);
  const fill = "#054388";
  const stroke = "#009CDD";
  const [decisionReady, setDecisionReady] = useState(false);
  const [lessExplReady, setLessExplReady] = useState(false);


  const textsTemp = [
    t`That's all you need to know! Time for a quick practice. Your task is to find and solve the first smart device. Now it's your decision`,
    t`Guided introduction`,
    t`Explore yourself`,
    t`Okay, try to walk to the smartTV and solve the challenge using the controls you just learned. I’ll meet you there`

]

  useEffect(() => {
    if (midContRef) {
      setShowExpl(true);
    }
  }, [midContRef]);

  //initialise
  useEffect(() => {
    if (onLoad && showExpl) {
      drawGraphics();
      drawTexts();
      setupArrowSprites();
      setOnLoad(false);
      firstRobotSprite();
      setAnimation(Anims.INTRO);
    }
  }, [showExpl]);

  //run intro anim
  const runIntroAnim = async (sprite: PixiSprite) => {
    const mgr = mgrRef.current!;
    const midC = midContRef.current;
    const midT = midTextRef.current;
    const leftC = leftContRef.current;
    const leftT = leftTextRef.current;
    const rightC = rightContRef.current;
    const rightT = rightTextRef.current;
    const leftArrC = leftArrRef.current;
    const rightArrC = rightArrRef.current;

    if (!midC || !midT || !leftC || !leftT || !rightC || !rightT || !leftArrC || !rightArrC) return;

    drawTexts();
    drawGraphics();

    const durationIn = 500;

    const grow = {
      startX: 0.5 * windowWidth, startY: windowHeight * 0.9,
      endX: windowWidth * 0.5, endY: windowHeight * 0.7,
      startS: 0.1, endS: 1.25, showOthers: true, duration: durationIn
    } as GrowProps

    const growLeft = {
      startX: 0.5 * windowWidth, startY: windowHeight * 0.9,
      endX: windowWidth * 0.415, endY: windowHeight * 0.59,
      startS: 0.05, endS: 0.2, showOthers: true, duration: durationIn
    } as GrowProps

    const growRight = {
      startX: 0.5 * windowWidth, startY: windowHeight * 0.9,
      endX: windowWidth * 0.585, endY: windowHeight * 0.59,
      startS: 0.05, endS: 0.2, showOthers: true, duration: durationIn
    } as GrowProps


    await mgr.parallel([
      () => fadeAnimation(mgr, [midT, midC, leftT, leftC, rightT, rightC], FADE_IN),
      () => growAnimation(mgr, leftArrC, growLeft),
      () => growAnimation(mgr, rightArrC, growRight),
      () => growAnimation(mgr, sprite, grow)
    ]);
  };

  //run fadeOut of first text
  const runFadeOutAnim = async () => {
    const mgr = mgrRef.current!;
    const midC = midContRef.current;
    const midT = midTextRef.current;
    const leftC = leftContRef.current;
    const leftT = leftTextRef.current;
    const rightC = rightContRef.current;
    const rightT = rightTextRef.current;
    const spriteC = spriteContainerRef.current;
    const leftArrC = leftArrRef.current;
    const rightArrC = rightArrRef.current;

    if (!midC || !midT || !leftC || !leftT || !rightC || !rightT || !spriteC || !leftArrC || !rightArrC) return;

    await mgr.parallel([
      () => fadeAnimation(mgr, [midC, leftT, leftC, rightT, rightC, spriteC, leftArrC, rightArrC], FADE_OUT),
    ]);
  };

  const runFadeAnim = async (fadeProps: FadeProps) => {
    const mgr = mgrRef.current!;
    const midC = midContRef.current;
    const midT = midTextRef.current;
    const spriteC = spriteContainerRef.current;

    if (!midC || !midT || !spriteC) return;

    await mgr.parallel([
      () => fadeAnimation(mgr, midT, fadeProps),
      () => fadeAnimation(mgr, midC, fadeProps),
      () => fadeAnimation(mgr, spriteC, fadeProps),
    ]);
  };

  //----------user input----------

  //keyControls
  useEffect(() => {
    if(keyControl != Pages.DECISION || animating)return;

    const onSpecialPressed = (e: globalThis.KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          if (showExpl && decisionReady){
            leftOnClick();
            setDecisionReady(false);
          }
          return;
        case "ArrowRight":
        case "KeyD":
          if (showExpl && decisionReady){
            rightOnClick();
            setDecisionReady(false);
          }
          return;
        case "Space":
          if (lessExplReady){
            setAnimation(Anims.OUTRO_LESS);
            setLessExplReady(false);
          }
          return;
      }
    }



    window.addEventListener("keydown", onSpecialPressed)
    return () => {
      window.removeEventListener("keydown", onSpecialPressed);
    };
  }, [keyControl, animating, showExpl, decisionReady, lessExplReady]);

  //manage animations
  useEffect(() => {
    if (!mgrRef.current) return;
    if (onLoad) return;

    let timeoutId: number | undefined;

    const run = async () => {

      const sprite = charRef.current;
      if (!sprite) return;

      switch (animation) {
        case Anims.INTRO:

          await runIntroAnim(sprite);
          setDecisionReady(true);
          setAnimation(Anims.IDLE);
          break;

        case Anims.SWITCH:
          await runFadeOutAnim();
          secondRobotSprite();
          await runFadeAnim(FADE_IN);
          setAnimation(Anims.IDLE);
          setLessExplReady(true);
          break;

        case Anims.OUTRO_MORE:
          setAnimating(true);
          await runFadeOutAnim();
          setAnimating(false);
          setKeyControl(Pages.MAIN);
          setNextPage(PageOrder.MORE_EXPL);
          break;

        case Anims.OUTRO_LESS:
          setAnimating(true);
          await runFadeAnim(FADE_OUT);
          setAnimating(false);
          setKeyControl(Pages.MAIN);
          setNextPage(PageOrder.LESS_EXPL);
          break;
      }
    };

    run();

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [animation]);


  //helpers
  const leftOnClick = () => {
    setAnimation(Anims.OUTRO_MORE);
  }

  const rightOnClick = () => {
    setAnimation(Anims.SWITCH);
  }

  //setupGraphics
  const firstRobotSprite = () => {
    const sprite = charRef.current;
    if (!sprite) return;
    sprite.texture = textureHandsUp;
  }

  const setupArrowSprites = () =>{
    const left = leftArrRef.current;
    const right = rightArrRef.current;

    if (!left || !right)return;


    left.x = windowWidth * 0.435;
    left.y = windowHeight * 0.6;
    left.anchor.set(0.5, 0.5);
    left.texture = textureLeftArr;
    left.scale.set(0.2);

    right.x = windowWidth * 0.565;
    right.y = windowHeight * 0.6;
    right.anchor.set(0.5, 0.5);
    right.texture = textureRightArr;
    right.scale.set(0.2);

  }

  const setupGraphics = (x: number, y: number, width: number, height: number, radius: number,
                         ref: RefObject<PixiContainer>, hoverEnabled: boolean, onClick: () => void) => {

    const g = new PixiGraphics();
    g.clear();
    g.beginFill(fill, 1);
    g.lineStyle(3, stroke);
    g.drawRoundedRect(x, y, width, height, radius);
    g.endFill();

    if (hoverEnabled){
      g.eventMode = "static";
      g.addEventListener("pointerover", () => g.cursor = "pointer");
      g.addEventListener("pointertap", onClick);
    }

    const parent = ref?.current;
    if (!parent) return;

    parent.addChild(g);
  }

  const drawGraphics = () =>{
    setupGraphics(windowWidth*0.3, windowHeight * 0.125, windowWidth*0.4, windowHeight *0.25, 10,
            midContRef, false, () => null);
    setupGraphics(windowWidth*0.3125, windowHeight * 0.4, windowWidth*0.15, windowHeight *0.1, 10,
            leftContRef, true, leftOnClick);
    setupGraphics(windowWidth*0.5375, windowHeight * 0.4, windowWidth*0.15, windowHeight *0.1, 10,
            rightContRef, true, rightOnClick);
  }

  const setupTexts = (text: string, x: number, y: number, fontSize: number, fontWeight: TextStyleFontWeight,
                      wrap: number, align: TextStyleAlign, ref: RefObject<PixiContainer>, anchor:number) => {
    const t1 = new PixiText();
    t1.text = text;
    t1.x = x;
    t1.y = y;
    t1.style = new TextStyle({
      fontSize: Math.min(windowWidth, windowHeight) * fontSize,
      fontWeight: fontWeight,
      wordWrap: true,
      wordWrapWidth: windowWidth * wrap,
      align: align,
      fontFamily: "LoResRegular",
      fill: "#FFFFFF"
    })
    t1.anchor.set(x = anchor, y = anchor);

    const parent = ref?.current;
    if (!parent) return;

    parent.addChild(t1);
  }

  //define text properties
  const drawTexts = () => {

    setupTexts(textsTemp[0], windowWidth*0.33, windowHeight*0.165, 0.04, "normal", 0.35,
            "center", midTextRef, 0);
    setupTexts(textsTemp[1], windowWidth*0.34, windowHeight*0.42, 0.03, "bold", 0.1,
            "center", leftTextRef, 0);
    setupTexts(textsTemp[2], windowWidth*0.58, windowHeight*0.42, 0.03, "bold", 0.1,
            "center", rightTextRef, 0);
  }




  //reassign graphics
  const secondRobotSprite = () => {
    const sprite = charRef.current;
    if (!sprite) return;
    sprite.x = windowWidth * 0.8;
    sprite.y = windowHeight * 0.6;
    sprite.texture = texturePointLeft;
    sprite.scale.set(1);

    const graphic = midContRef.current;
    if (!graphic) return;
    graphic.removeChildren();
    setupGraphics(windowWidth*0.275, windowHeight*0.3,windowWidth*0.45, windowHeight*0.2, 10,
            midContRef, false, () => null);

    const textC = midTextRef.current;
    if (!textC) return;
    textC.removeChildren();
    setupTexts(textsTemp[textsTemp.length-1], windowWidth*0.5,windowHeight*0.4, 0.04, "normal",
            0.4, "center", midTextRef, 0.5);
  }



  const sprite = () => {
   return (
           <Container ref={spriteContainerRef}>
             {<Sprite texture={textureHandsUp} ref={charRef} />}
           </Container>)
  }

  const arrowKeys = () =>{
    return (
            <>
              {showExpl && textureLeftArr && textureLeftArr &&
                      (<Sprite ref={leftArrRef} texture={textureLeftArr}/>)}
              {showExpl && textureRightArr && textureRightArr &&
                      (<Sprite ref={rightArrRef} texture={textureRightArr}/>)}
            </>
    )
  }

  const graphics = () => {
    return (

            <Container>
              {showExpl && <Container ref={midContRef}/>}
              {showExpl && <Container ref={leftContRef}/>}
              {showExpl &&<Container ref={rightContRef}/>}
              {showExpl && <Container ref={midTextRef}/>}
              {showExpl && <Container ref={leftTextRef}/>}
              {showExpl &&<Container ref={rightTextRef}/>}
            </Container>


    )
  }

  return (
      <>
        {graphics()}
        {sprite()}
        {arrowKeys()}
      </>
  )
};