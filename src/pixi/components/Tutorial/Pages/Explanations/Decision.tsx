import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Container, Graphics, Sprite, Text } from "@pixi/react";
import handsUp from "@/assets/tutorial/explanationPages/handsUp.png";
import pointLeft from "@/assets/tutorial/explanationPages/pointLeft.png";
import leftKey from "@/assets/tutorial/explanationPages/leftKey.png";
import rightKey from "@/assets/tutorial/explanationPages/rightKey.png";
import { loadTexture } from "@/utils/loadTexture.ts";
import {
  Container as PixiContainer,
  Sprite as PixiSprite,
  TextStyle,
  Texture,
} from "pixi.js";
import { Pages } from "@/pixi/components/Tutorial/Pages/Pages.ts";
import { growAnimation, GrowProps } from "@/pixi/components/Tutorial/anim/growAnimation.ts";
import { PageProps } from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import { fadeAnimation, FadeProps } from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import "@pixi/events";
import { FADE_IN, FADE_OUT } from "@/pixi/components/Tutorial/util/AnimProps.ts";
import { PageOrder } from "@/pixi/components/Tutorial/util/PageOrder.ts";
import { useAnimationManager } from "@/hooks/tutorial/useAnimationManager.tsx";
import { t } from "@lingui/core/macro";

export const Decision: React.FC<PageProps> = ({
                                                windowWidth,
                                                windowHeight,
                                                keyControl,
                                                setKeyControl,
                                                setNextPage,
                                              }: PropsWithChildren<PageProps>) => {
  enum Anims {
    IDLE,
    INTRO,
    SWITCH,
    OUTRO_LESS,
    OUTRO_MORE,
  }

  const textureHandsUp = useMemo(() => loadTexture(handsUp), []);
  const texturePointLeft = useMemo(() => loadTexture(pointLeft), []);
  const textureLeftArr = useMemo(() => loadTexture(leftKey), []);
  const textureRightArr = useMemo(() => loadTexture(rightKey), []);

  const leftArrRef = useRef<PixiSprite | null>(null);
  const rightArrRef = useRef<PixiSprite | null>(null);
  const charRef = useRef<PixiSprite | null>(null);
  const spriteContainerRef = useRef<PixiContainer | null>(null);

  const midContRef = useRef<PixiContainer | null>(null);
  const leftContRef = useRef<PixiContainer | null>(null);
  const rightContRef = useRef<PixiContainer | null>(null);

  const midTextRef = useRef<PixiContainer | null>(null);
  const leftTextRef = useRef<PixiContainer | null>(null);
  const rightTextRef = useRef<PixiContainer | null>(null);

  const [animation, setAnimation] = useState(Anims.IDLE);
  const [showExpl, setShowExpl] = useState(false);
  const [onLoad, setOnLoad] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [decisionReady, setDecisionReady] = useState(false);
  const [lessExplReady, setLessExplReady] = useState(false);

  const mgrRef = useAnimationManager();

  const textsTemp = useMemo(
          () => [
            t`That's all you need to know! Time for a quick practice. Your task is to find and solve the first smart device. Now it's your decision`,
            t`Guided introduction`,
            t`Explore yourself`,
            t`Okay, try to walk to the smartTV and solve the challenge using the controls you just learned. I’ll meet you there`,
          ],
          []
  );

  const layout = useMemo(() => {
    const f = Math.min(windowWidth, windowHeight);
    return {
      panel: {
        mid: { x: 0.3 * windowWidth, y: 0.125 * windowHeight, w: 0.4 * windowWidth, h: 0.25 * windowHeight, r: 10 },
        left: { x: 0.3125 * windowWidth, y: 0.4 * windowHeight, w: 0.15 * windowWidth, h: 0.1 * windowHeight, r: 10 },
        right: { x: 0.5375 * windowWidth, y: 0.4 * windowHeight, w: 0.15 * windowWidth, h: 0.1 * windowHeight, r: 10 },
      },
      text: {
        mid: { x: 0.33 * windowWidth, y: 0.165 * windowHeight, fs: 0.04 * f, wrap: 0.35 * windowWidth },
        left: { x: 0.34 * windowWidth, y: 0.42 * windowHeight, fs: 0.03 * f, wrap: 0.1 * windowWidth },
        right: { x: 0.58 * windowWidth, y: 0.42 * windowHeight, fs: 0.03 * f, wrap: 0.1 * windowWidth },
        outro: { x: 0.5 * windowWidth, y: 0.25 * windowHeight, fs: 0.04 * f, wrap: 0.4 * windowWidth },
      },
      arrows: { s: f / 3000 },
      robot: { s: f / 750, pos: { x: 0.5 * windowWidth, y: 0.7 * windowHeight } },
      colors: { fill: 0x054388, stroke: 0x009cdd },
    };
  }, [windowWidth, windowHeight]);

  const drawMidPanel = useCallback(
          (g: any) => {
            g.clear();
            const { fill, stroke } = layout.colors;
            g.lineStyle(3, stroke, 1);
            g.beginFill(fill, 1);
            g.drawRoundedRect(
                    layout.panel.mid.x,
                    layout.panel.mid.y,
                    layout.panel.mid.w,
                    layout.panel.mid.h,
                    layout.panel.mid.r
            );
            g.endFill();
          },
          [layout]
  );

  const whenTextureValid = (tex: Texture | undefined, cb: () => void) => {
    if (!tex) return;
    if ((tex.baseTexture as any)?.valid) {
      cb();
    } else {
      tex.baseTexture.once("loaded", cb);
    }
  };

  const placeArrowsFromSprite = useCallback(
          (sprite: PixiSprite, targetScale: number) => {
            const l = leftArrRef.current;
            const r = rightArrRef.current;
            if (!l || !r) return;

            const texW = sprite.texture?.width ?? 0;
            const texH = sprite.texture?.height ?? 0;

            if (texW === 0 || texH === 0) {
              requestAnimationFrame(() => placeArrowsFromSprite(sprite, targetScale));
              return;
            }

            const w = texW * targetScale;
            const h = texH * targetScale;

            l.texture = textureLeftArr;
            r.texture = textureRightArr;
            l.scale.set(layout.arrows.s);
            r.scale.set(layout.arrows.s);

            l.x = layout.robot.pos.x - w * 0.375;
            l.y = layout.robot.pos.y - h * 0.25;

            r.x = layout.robot.pos.x + w * 0.375;
            r.y = layout.robot.pos.y - h * 0.25;
          },
          [layout.arrows.s, layout.robot.pos.x, layout.robot.pos.y, textureLeftArr, textureRightArr]
  );

  useEffect(() => {
    const s = charRef.current;
    if (!s || !showExpl) return;

    if (!lessExplReady) {
      s.x = layout.robot.pos.x;
      s.y = layout.robot.pos.y;
      whenTextureValid(s.texture, () => {
        s.scale.set(layout.robot.s);
        placeArrowsFromSprite(s, layout.robot.s);
      });
    } else {
      s.x = windowWidth * 0.8;
      s.y = windowHeight * 0.6;
      whenTextureValid(s.texture, () => s.scale.set(layout.robot.s));
    }
  }, [
    showExpl,
    lessExplReady,
    layout.robot.pos.x,
    layout.robot.pos.y,
    layout.robot.s,
    windowWidth,
    windowHeight,
  ]);

  useEffect(() => {
    if (!lessExplReady) return;
    const s = charRef.current;
    if (!s) return;

    s.x = windowWidth * 0.8;
    s.y = windowHeight * 0.6;
    s.texture = texturePointLeft;

    whenTextureValid(s.texture, () => {
      s.scale.set(layout.robot.s);
    });
  }, [lessExplReady, windowWidth, windowHeight, layout.robot.s, texturePointLeft]);

  const secondRobotSprite = useCallback(() => {
    const sprite = charRef.current;
    if (!sprite) return;
    sprite.x = windowWidth * 0.8;
    sprite.y = windowHeight * 0.6;
    sprite.texture = texturePointLeft;
    sprite.scale.set(layout.robot.s);
  }, [texturePointLeft, windowWidth, windowHeight, layout.robot.s]);

  useEffect(() => {
    if (midContRef) setShowExpl(true);
  }, []);

  const leftOnClick = useCallback(() => setAnimation(Anims.OUTRO_MORE), []);
  const rightOnClick = useCallback(() => setAnimation(Anims.SWITCH), []);

  useEffect(() => {
    if (!showExpl) return;
    const nodes = [
      midContRef.current,
      leftContRef.current,
      rightContRef.current,
      midTextRef.current,
      leftTextRef.current,
      rightTextRef.current,
      spriteContainerRef.current,
      leftArrRef.current,
      rightArrRef.current,
    ].filter(Boolean) as PixiContainer[];
    nodes.forEach((n) => (n.alpha = 0));
  }, [showExpl]);


  const runIntroAnim = useCallback(async (sprite: PixiSprite) => {
    const mgr = mgrRef.current!;
    const midC = midContRef.current, midT = midTextRef.current;
    const leftC = leftContRef.current, leftT = leftTextRef.current;
    const rightC = rightContRef.current, rightT = rightTextRef.current;
    const leftArrC = leftArrRef.current, rightArrC = rightArrRef.current;
    const spriteC = spriteContainerRef.current;
    if (!midC || !midT || !leftC || !leftT || !rightC || !rightT || !leftArrC || !rightArrC || !spriteC) return;

    const durationIn = 500;

    await new Promise<void>((resolve) => whenTextureValid(sprite.texture, resolve));

    const targetScale = layout.robot.s;
    const texW = sprite.texture?.width ?? 0;
    const texH = sprite.texture?.height ?? 0;
    const w = texW * targetScale;
    const h = texH * targetScale;

    leftArrC.visible = true;
    rightArrC.visible = true;

    spriteC.alpha = 1;
    leftArrC.alpha = 1;
    rightArrC.alpha = 1;

    const targets = {
      left: { x: layout.robot.pos.x - w * 0.375, y: layout.robot.pos.y - h * 0.25 },
      right:{ x: layout.robot.pos.x + w * 0.375, y: layout.robot.pos.y - h * 0.25 },
    };

    const startS = Math.min(windowWidth, windowHeight) / 3000;

    const growMid: GrowProps = { startX: layout.robot.pos.x, startY: windowHeight * 0.9, endX: layout.robot.pos.x, endY: layout.robot.pos.y, startS, endS: targetScale, duration: durationIn };
    const growLeft: GrowProps = { startX: layout.robot.pos.x, startY: windowHeight * 0.9, endX: targets.left.x, endY: targets.left.y, startS, endS: layout.arrows.s, duration: durationIn };
    const growRight: GrowProps = { startX: layout.robot.pos.x, startY: windowHeight * 0.9, endX: targets.right.x, endY: targets.right.y, startS, endS: layout.arrows.s, duration: durationIn };

    sprite.alpha = 1;

    await mgr.parallel([
      () => fadeAnimation(mgr, [midT, midC, leftT, leftC, rightT, rightC], FADE_IN),
      () => growAnimation(mgr, leftArrC, growLeft),
      () => growAnimation(mgr, rightArrC, growRight),
      () => growAnimation(mgr, sprite,   growMid),
    ]);
  }, [mgrRef, layout.robot.pos.x, layout.robot.pos.y, layout.robot.s, layout.arrows.s, windowHeight, windowWidth]);

  const runFadeOutAnim = useCallback(async () => {
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
  }, [mgrRef]);

  const runFadeAnim = useCallback(
          async (fadeProps: FadeProps) => {
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
          },
          [mgrRef]
  );

  useEffect(() => {
    if (onLoad && showExpl) {
      setOnLoad(false);
      setAnimation(Anims.INTRO);
    }
  }, [showExpl, onLoad]);

  useEffect(() => {
    if (!mgrRef.current || onLoad) return;

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
          leftArrRef.current && (leftArrRef.current.visible = false);
          rightArrRef.current && (rightArrRef.current.visible = false);
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
  }, [
    animation,
    Anims.IDLE,
    Anims.INTRO,
    Anims.OUTRO_LESS,
    Anims.OUTRO_MORE,
    Anims.SWITCH,
    mgrRef,
    onLoad,
    runFadeAnim,
    runFadeOutAnim,
    runIntroAnim,
    secondRobotSprite,
    setKeyControl,
    setNextPage,
  ]);

  useEffect(() => {
    if (keyControl !== Pages.DECISION || animating) return;

    const onSpecialPressed = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          if (showExpl && decisionReady) {
            leftOnClick();
            setDecisionReady(false);
          }
          return;
        case "ArrowRight":
        case "KeyD":
          if (showExpl && decisionReady) {
            rightOnClick();
            setDecisionReady(false);
          }
          return;
        case "Space":
          if (lessExplReady) {
            setAnimation(Anims.OUTRO_LESS);
          }
          return;
      }
    };

    window.addEventListener("keydown", onSpecialPressed);
    return () => window.removeEventListener("keydown", onSpecialPressed);
  }, [keyControl, animating, showExpl, decisionReady, lessExplReady, leftOnClick, rightOnClick]);

  const showDecisionUI = showExpl && !lessExplReady && animation !== Anims.SWITCH;


  return (
          <>
            <Container sortableChildren>
              {showExpl && (
                      <Container ref={midContRef} zIndex={0}>
                        <Graphics draw={drawMidPanel} />
                      </Container>
              )}

              {showDecisionUI && (
                      <>
                        <Container
                                ref={leftContRef}
                                eventMode="static"
                                pointerover={(e: any) => (e.currentTarget.cursor = "pointer")}
                                pointertap={leftOnClick}
                                zIndex={0}
                        >
                          <Graphics
                                  draw={(g) => {
                                    g.clear();
                                    g.lineStyle(3, layout.colors.stroke, 1);
                                    g.beginFill(layout.colors.fill, 1);
                                    g.drawRoundedRect(
                                            layout.panel.left.x,
                                            layout.panel.left.y,
                                            layout.panel.left.w,
                                            layout.panel.left.h,
                                            layout.panel.left.r
                                    );
                                    g.endFill();
                                  }}
                          />
                        </Container>

                        <Container
                                ref={rightContRef}
                                eventMode="static"
                                pointerover={(e: any) => (e.currentTarget.cursor = "pointer")}
                                pointertap={rightOnClick}
                                zIndex={0}
                        >
                          <Graphics
                                  draw={(g) => {
                                    g.clear();
                                    g.lineStyle(3, layout.colors.stroke, 1);
                                    g.beginFill(layout.colors.fill, 1);
                                    g.drawRoundedRect(
                                            layout.panel.right.x,
                                            layout.panel.right.y,
                                            layout.panel.right.w,
                                            layout.panel.right.h,
                                            layout.panel.right.r
                                    );
                                    g.endFill();
                                  }}
                          />
                        </Container>

                        <Container ref={midTextRef} zIndex={1}>
                          <Text
                                  text={textsTemp[0]}
                                  x={layout.text.mid.x}
                                  y={layout.text.mid.y}
                                  style={
                                    new TextStyle({
                                      fontFamily: "LoResRegular",
                                      fontSize: layout.text.mid.fs,
                                      wordWrap: true,
                                      wordWrapWidth: layout.text.mid.wrap,
                                      fill: "#FFFFFF",
                                      align: "center",
                                    })
                                  }
                          />
                        </Container>

                        <Container ref={leftTextRef} zIndex={1}>
                          <Text
                                  text={textsTemp[1]}
                                  x={layout.text.left.x}
                                  y={layout.text.left.y}
                                  style={
                                    new TextStyle({
                                      fontFamily: "LoResRegular",
                                      fontSize: layout.text.left.fs,
                                      fontWeight: "bold",
                                      wordWrap: true,
                                      wordWrapWidth: layout.text.left.wrap,
                                      fill: "#FFFFFF",
                                      align: "center",
                                    })
                                  }
                          />
                        </Container>

                        <Container ref={rightTextRef} zIndex={1}>
                          <Text
                                  text={textsTemp[2]}
                                  x={layout.text.right.x}
                                  y={layout.text.right.y}
                                  style={
                                    new TextStyle({
                                      fontFamily: "LoResRegular",
                                      fontSize: layout.text.right.fs,
                                      fontWeight: "bold",
                                      wordWrap: true,
                                      wordWrapWidth: layout.text.right.wrap,
                                      fill: "#FFFFFF",
                                      align: "center",
                                    })
                                  }
                          />
                        </Container>
                      </>
              )}

              {showExpl && !showDecisionUI && (
                      <Container ref={midTextRef} zIndex={1}>
                        <Text
                                text={textsTemp[textsTemp.length - 1]}
                                x={layout.text.outro.x}
                                y={layout.text.outro.y}
                                anchor={0.5}
                                style={
                                  new TextStyle({
                                    fontFamily: "LoResRegular",
                                    fontSize: layout.text.outro.fs,
                                    wordWrap: true,
                                    wordWrapWidth: layout.text.outro.wrap,
                                    fill: "#FFFFFF",
                                    align: "center",
                                  })
                                }
                        />
                      </Container>
              )}

              <Container ref={spriteContainerRef} zIndex={2}>
                <Sprite texture={textureHandsUp} ref={charRef} />
              </Container>
              {showExpl && textureLeftArr && <Sprite ref={leftArrRef} texture={textureLeftArr} zIndex={2} />}
              {showExpl && textureRightArr && <Sprite ref={rightArrRef} texture={textureRightArr} zIndex={2} />}
            </Container>
          </>
  );
};
