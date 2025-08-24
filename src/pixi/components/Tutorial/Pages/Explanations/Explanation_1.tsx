import React, {
  KeyboardEvent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {Container, Sprite} from "@pixi/react";
import handsUp from "@/assets/tutorial/explanationPages/handsUp.png";
import pointLeft from "@/assets/tutorial/explanationPages/pointLeft.png";
import leftKey from "@/assets/tutorial/explanationPages/leftKey.png";
import rightKey from "@/assets/tutorial/explanationPages/rightKey.png";
import {loadTexture} from "@/utils/loadTexture.ts";
import {
  Container as PixiContainer,
  Sprite as PixiSprite,
  Graphics as PixiGraphics,
  Text as PixiText,
  TextStyle, TextStyleAlign,
  TextStyleFontWeight
} from "pixi.js";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {AnimationManager} from "@/pixi/components/Tutorial/anim/AnimationManager.ts";
import {growAnimation, GrowProps} from "@/pixi/components/Tutorial/anim/growTween.ts";
import {PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {fadeAnimation, FadeProps} from "@/pixi/components/Tutorial/anim/fadeTween.ts";
import '@pixi/events';
import type {} from '@pixi/events';

export const Explanation_1: React.FC<PageProps> = ({
       windowWidth,
       windowHeight,
       keyControl,
       setKeyControl,
       setNextPage
           }: PropsWithChildren<PageProps>) => {

  enum Anims {IDLE, INTRO, SWITCH, OUTRO}
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
  const [showSprite, setShowSprite] = useState(true);
  const mgrRef = useRef<AnimationManager | null>(null);
  const spriteContainerRef = useRef(null)
  const midTextRef = useRef<PixiContainer | null>(null);
  const leftTextRef = useRef<PixiContainer | null>(null);
  const rightTextRef = useRef<PixiContainer | null>(null);
  const midContRef = useRef<PixiContainer | null>(null);
  const leftContRef = useRef<PixiContainer | null>(null);
  const rightContRef = useRef<PixiContainer | null>(null);
  const [decision, setDecision] = useState(0);
  const fill = "#054388";
  const stroke = "#009CDD";


  const textsTemp = [
          "That's all you need to know! Time for a quick practice. Your task is to find and solve the first smart device."+
          " Now it's your decision",
          "Guided introduction",
          "Explore yourself",
          "Okay, try to walk to the smartTV and solve the challenge using the controls you just learned. I’ll meet you there"

]

  //cleanup animations
  useEffect(() => {
    mgrRef.current = new AnimationManager();
    return () => mgrRef.current?.cancelAll();
  }, []);

  //cleanup animations

  useEffect(() => {
    if (midContRef) {
      setShowExpl(true);
    }
  }, [midContRef]);

  useEffect(() => {
    if (onLoad && showExpl) {
      drawGraphics();
      drawTexts();
      setupSprites();
      setOnLoad(false);
      firstSprite();
      setAnimation(Anims.INTRO);
    }
  }, [showExpl]);

  //run grow/shrink animation
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

    const fadeIn = {
      duration: durationIn,
      startA: 0,
      endA: 1,
    } as FadeProps


    await mgr.parallel([
      () => fadeAnimation(mgr, midT, fadeIn),
      () => fadeAnimation(mgr, midC, fadeIn),
      () => fadeAnimation(mgr, leftT, fadeIn),
      () => fadeAnimation(mgr, leftC, fadeIn),
      () => fadeAnimation(mgr, rightT, fadeIn),
      () => fadeAnimation(mgr, rightC, fadeIn),
      () => growAnimation(mgr, leftArrC, growLeft),
      () => growAnimation(mgr, rightArrC, growRight),
      () => growAnimation(mgr, sprite, grow)
    ]);
  };
  const runFadeOutAnim = async (sprite: PixiSprite) => {
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

    const durationOut = 500;

    const fadeOut = {
      duration: durationOut,
      startA: 1,
      endA: 0,
    } as FadeProps

    await mgr.parallel([
      () => fadeAnimation(mgr, midT, fadeOut),
      () => fadeAnimation(mgr, midC, fadeOut),
      () => fadeAnimation(mgr, leftT, fadeOut),
      () => fadeAnimation(mgr, leftC, fadeOut),
      () => fadeAnimation(mgr, rightT, fadeOut),
      () => fadeAnimation(mgr, rightC, fadeOut),
      () => fadeAnimation(mgr, spriteC, fadeOut),
      () => fadeAnimation(mgr, leftArrC, fadeOut),
      () => fadeAnimation(mgr, rightArrC, fadeOut)
    ]);
  };

  const runFadeInAnim = async (sprite: PixiSprite) => {
    const mgr = mgrRef.current!;
    const midC = midContRef.current;
    const midT = midTextRef.current;
    const spriteC = spriteContainerRef.current;

    if (!midC || !midT || !spriteC) return;

    const durationOut = 500;

    const fadeIn = {
      duration: durationOut,
      startA: 0,
      endA: 1,
    } as FadeProps

    await mgr.parallel([
      () => fadeAnimation(mgr, midT, fadeIn),
      () => fadeAnimation(mgr, midC, fadeIn),
      () => fadeAnimation(mgr, spriteC, fadeIn),
    ]);
  };

  //----------user input----------

  //keyControls
  useEffect(() => {
    if(keyControl != Pages.EXPLANATION1 || animating)return;

    const onSpecialPressed = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
          if (showExpl){
            leftOnClick()}
          return;
        case "ArrowRight":
          if (showExpl){
            rightOnClick()}
          return;
      }
    }



    window.addEventListener("keydown", onSpecialPressed)
    return () => {
      window.removeEventListener("keydown", onSpecialPressed);
    };
  }, [keyControl, animating, showExpl]);

  //manage animations
  useEffect(() => {
    if (!mgrRef.current) return;
    if (onLoad) return;

    let timeoutId: number | undefined;
    let cancelled = false;

    const run = async () => {

      const sprite = charRef.current;
      if (!sprite) return;

      switch (animation) {
        case 1:

          await runIntroAnim(sprite);
          setAnimation(Anims.IDLE);
          break;

        case 2:
          await runFadeOutAnim(sprite);
          secondSprite();
          await runFadeInAnim(sprite);
          setAnimation(Anims.IDLE);
          break;

        case 3:
          await runFadeOutAnim(sprite);
          setShowExpl(false);
          setAnimating(true);
          setShowSprite(false);
          setKeyControl(Pages.MAIN);
          setNextPage(decision == 0 ? 5 : 6);
          break;
      }
    };

    run();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [animation]);



  //----------drawings----------

  //store line properties in pixiGraphic
  const setupTexts = (text: string, x: number, y: number, fontSize: number, fontWeight: TextStyleFontWeight,
                      wrap: number, align: TextStyleAlign, ref, anchor:number) => {
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

  const setupGraphics = (x: number, y: number, width: number, height: number, radius: number,
                         ref, hoverEnabled: boolean, onClick: () => void) => {

    const g = new PixiGraphics();
    g.clear();
    g.beginFill(fill, 1);
    g.lineStyle(3, stroke);
    g.drawRoundedRect(x, y, width, height, 8);
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
            midContRef, false, null);
    setupGraphics(windowWidth*0.3125, windowHeight * 0.4, windowWidth*0.15, windowHeight *0.1, 10,
            leftContRef, true, leftOnClick);
    setupGraphics(windowWidth*0.5375, windowHeight * 0.4, windowWidth*0.15, windowHeight *0.1, 10,
            rightContRef, true, rightOnClick);
  }

  const setupSprites = () =>{
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

  const leftOnClick = () => {
    setDecision(0);
    setAnimation(Anims.OUTRO);
  }

  const rightOnClick = () => {
      setAnimation(Anims.SWITCH);
  }

  const firstSprite = () => {
    const sprite = charRef.current;
    if (!sprite) return;
    console.log("firstSprite");
    sprite.texture = textureHandsUp;
  }
  const secondSprite = () => {
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
            midContRef, false, null);

    const textC = midTextRef.current;
    if (!textC) return;
    textC.removeChildren();
    setupTexts(textsTemp[textsTemp.length-1], windowWidth*0.5,windowHeight*0.4, 0.04, "normal",
            0.4, "center", midTextRef, 0.5);
  }

  const sprite = () => {
   return (
           <Container ref={spriteContainerRef}>
             {showSprite && <Sprite texture={textureHandsUp} ref={charRef} />}
           </Container>)
  }

  return (
      <>
        {graphics()}
        {sprite()}
        {arrowKeys()}
      </>
  )
};