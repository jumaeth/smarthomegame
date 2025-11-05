import React, {PropsWithChildren, useCallback, useEffect, useRef, useState} from "react";
import {Container, Graphics} from "@pixi/react";
import {Container as PixiContainer, Graphics as PixiGraphics} from "pixi.js";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {PAGE_COMPONENTS, PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {spotlightAnimation} from "@/pixi/components/Tutorial/anim/spotlightAnimation.ts";
import {fadeAnimation, FadeProps} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {GameService} from "@/services/GameService.ts";
import {characterPositionStore} from "@/utils/characterPosition.ts";
import {InteractivePixiElement} from "@/objects/InteractivePixiElement.ts";
import {drawBackground} from "@/pixi/components/Tutorial/util/drawings.tsx";
import {introText, phone, player, scores, tv, tv2} from "@/pixi/components/Tutorial/util/spotLightPositions.ts";
import {SPOTLIGHT_DURATION} from "@/pixi/components/Tutorial/util/Constants.ts";
import {useAnimationManager} from "@/hooks/tutorial/useAnimationManager.tsx";
import {RoomNames} from "@/objects/RoomNames.ts";
import {PageOrder} from "@/pixi/components/Tutorial/util/PageOrder.ts";

interface TutorialProps {
  windowWidth: number;
  windowHeight: number;
  gameService: GameService;
  onClose: () => void;
  interactiveElements: InteractivePixiElement[];
}

export const Tutorial: React.FC<TutorialProps> = ({
                                                    windowWidth,
                                                    windowHeight,
                                                    gameService,
                                                    onClose,
                                                    interactiveElements
                                                  }: PropsWithChildren<TutorialProps>) => {
  const [nextPage, setNextPage] = useState(PageOrder.INTRO);
  const [keyControl, setKeyControl] = useState(Pages.MAIN);

  const rootRef = useRef<PixiContainer | null>(null);
  const backgroundRef = useRef<PixiGraphics | null>(null);

  const mgrRef = useAnimationManager();
  const isAnimatingRef = useRef<boolean>(false);

  const wRef = useRef(windowWidth);
  const hRef = useRef(windowHeight);

  useEffect(() => {
    if (keyControl == Pages.PROGRESS_BAR)return;
    wRef.current = windowWidth;
    hRef.current = windowHeight;
    if (backgroundRef.current && (keyControl == Pages.MAIN || keyControl == Pages.MORE_EXPL
    )) {
      drawBackground(backgroundRef, windowWidth, windowHeight);
    }
  }, [windowWidth, windowHeight, keyControl]);

  useEffect(() => {
    characterPositionStore.teleport({ x: 8 * TILE_SIZE, y: 5 * TILE_SIZE });
    gameService.pauseGame();
  }, [gameService]);

  const runClearBGAnim = useCallback(async () => {
    const mgr = mgrRef.current;
    const bg = backgroundRef.current;
    if (!mgr || !bg) return;
    await mgr.parallel([
      () => fadeAnimation(mgr, bg, { startA: bg.alpha, endA: 0, duration: 1000 } as FadeProps),
    ]);
  }, [mgrRef]);

  const ranRef = useRef<Set<PageOrder>>(new Set());

  useEffect(() => {
    if (ranRef.current.has(nextPage)) return;
    ranRef.current.add(nextPage);

    let timeoutId: number | undefined;

    const run = async () => {
      const mgr = mgrRef.current;
      if (!mgr) return;

      const W = wRef.current;
      const H = hRef.current;

      switch (nextPage) {
        case PageOrder.INTRO: {
          setKeyControl(Pages.INTRO);
          break;
        }

        case PageOrder.CHARACTER: {
          isAnimatingRef.current = true;
          await mgr.sequence([
            () => spotlightAnimation(mgr, backgroundRef, W, H, introText(W, H), player(W, H), SPOTLIGHT_DURATION),
          ]);
          isAnimatingRef.current = false;
          drawBackground(backgroundRef, W, H);
          setKeyControl(Pages.CHARACTER);
          return;
        }

        case PageOrder.SCORES: {
          await mgr.sequence([
            () => spotlightAnimation(mgr, backgroundRef, W, H, player(W, H), scores(W, H), SPOTLIGHT_DURATION),
          ]);
          drawBackground(backgroundRef, W, H);
          setKeyControl(Pages.SCORES);
          return;
        }

        case PageOrder.PHONE: {
          isAnimatingRef.current = true;
          await mgr.sequence([
            () => spotlightAnimation(mgr, backgroundRef, W, H, scores(W, H), phone(W, H), SPOTLIGHT_DURATION * 1.5),
          ]);
          isAnimatingRef.current = false;
          drawBackground(backgroundRef, W, H);
          setKeyControl(Pages.SMARTPHONE);
          return;
        }

        case PageOrder.DECISION: {
          drawBackground(backgroundRef, W, H);
          setKeyControl(Pages.DECISION);
          return;
        }

        case PageOrder.MORE_EXPL: {
          isAnimatingRef.current = true;
          await mgr.sequence([
            () => spotlightAnimation(mgr, backgroundRef, W, H, player(W, H), tv(W, H), SPOTLIGHT_DURATION),
          ]);
          isAnimatingRef.current = false;
          setKeyControl(Pages.MORE_EXPL);
          return;
        }

        case PageOrder.LESS_EXPL: {
          await runClearBGAnim();
          gameService.resumeGame();
          return;
        }

        case PageOrder.More_Expl_SD: {
          await runClearBGAnim();
          gameService.resumeGame();
          setKeyControl(Pages.More_Expl_SD);
          return;
        }

        case PageOrder.SCORE_CHANGES: {
          gameService.pauseGame();
          drawBackground(backgroundRef, W, H);

          characterPositionStore.teleport({ x: 5 * TILE_SIZE, y: 3 * TILE_SIZE });
          isAnimatingRef.current = true;
          await mgr.sequence([
            () => spotlightAnimation(mgr, backgroundRef, W, H, tv2(W, H), scores(W, H), SPOTLIGHT_DURATION * 1.5),
          ]);
          isAnimatingRef.current = false;
          drawBackground(backgroundRef, W, H);

          const bg = backgroundRef.current;
          if (!bg) return;
          bg.clear();

          setKeyControl(Pages.SCORE_CHANGES);
          return;
        }


        case PageOrder.PROGRESS_BAR: {

          const bg = backgroundRef.current;
          if (!bg) return;
          bg.clear();

          setKeyControl(Pages.PROGRESS_BAR);
          return;
        }


        case PageOrder.END: {
          gameService.resumeGame();
          onClose();
          return;
        }
      }
    };

    run();

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [nextPage, gameService, mgrRef, onClose, runClearBGAnim]);

  useEffect(() => {
    const devices = gameService.getDeviceForRoom(RoomNames.LIVINGROOM);
    const tvDevice = devices.find(d => d.name === "SmartTv");
    if (!tvDevice) return;

    const unsubscribe = tvDevice.subscribe(device => {
      if (device.getIsCompleted() && nextPage === PageOrder.LESS_EXPL) {
        setNextPage(PageOrder.SCORE_CHANGES);
      }
    });

    return () => unsubscribe();
  }, [nextPage, gameService]);

  const background = () => <Graphics ref={backgroundRef} />;

  const commonProps: PageProps = {
    windowWidth,
    windowHeight,
    keyControl,
    setKeyControl,
    setNextPage,
    interactiveElements,
    gameService
  };
  const ActivePage = PAGE_COMPONENTS[keyControl];

  return (
          <>
            {background()}
            <Container ref={rootRef} />
            {ActivePage && <ActivePage key={keyControl} {...commonProps} />}
          </>
  );
};
