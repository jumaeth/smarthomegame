import React, {PropsWithChildren, useCallback, useEffect, useRef, useState} from "react";
import {Container, Graphics} from "@pixi/react";
import {Container as PixiContainer, Graphics as PixiGraphics} from "pixi.js";
import {TILE_SIZE} from "@/pixi/constants/world-settings.ts";
import {Pages} from "@/pixi/components/Tutorial/Pages/Pages.ts";
import {PAGE_COMPONENTS, PageProps} from "@/pixi/components/Tutorial/Pages/pageRegistry.ts";
import {spotlightAnimation} from "@/pixi/components/Tutorial/anim/spotlightAnimation.ts";
import {fadeAnimation, FadeProps} from "@/pixi/components/Tutorial/anim/fadeAnimation.ts";
import {GameService} from "@/services/GameService.ts";
import {characterPositionStore} from "@/utils/character/characterPosition.ts";
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
  interactiveElements:  InteractivePixiElement[];
}

export const Tutorial: React.FC<TutorialProps> = ({
       windowWidth,
       windowHeight,
       gameService,
       onClose,
        interactiveElements
           }: PropsWithChildren<TutorialProps>) => {

  const [nextPage, setNextPage] = useState(PageOrder.INTRO);

  const rootRef = useRef<PixiContainer | null>(null);


  const backgroundRef = useRef<PixiGraphics | null>(null);
  const [keyControl, setKeyControl] = useState(Pages.MAIN)

  const commonProps: PageProps = { windowWidth, windowHeight, keyControl, setKeyControl, setNextPage, interactiveElements, gameService };
  const ActivePage = PAGE_COMPONENTS[keyControl]; // Component or null

  const mgrRef = useAnimationManager();
  const isAnimatingRef = useRef<boolean>(false);

  //initBackground
  useEffect(() => {
    if (backgroundRef.current){
      drawBackground(backgroundRef, windowWidth, windowHeight);
    }
  }, [windowHeight, windowWidth]);

  //pause game at beginning of tutorial
  useEffect(() => {
    characterPositionStore.teleport({x: 8*TILE_SIZE, y: 5*TILE_SIZE});
    gameService.pauseGame();
  }, [gameService]);

  const runClearBGAnim = useCallback(
          async () => {

            const mgr = mgrRef.current;
            const bg = backgroundRef.current;

            if(!mgr || !bg)return;

            await mgr.parallel([
              () => fadeAnimation(mgr, bg, {startA: bg.alpha, endA: 0, duration: 1000} as FadeProps),
            ]);
          },[mgrRef]
  )

  //manage animations
  useEffect(() => {

    let timeoutId: number | undefined;

    const run = async () => {

      const mgr = mgrRef.current;
      if (!mgr)return;

      switch (nextPage) {

        case PageOrder.INTRO: {

          setKeyControl(Pages.INTRO);
          break;
        }

        case PageOrder.CHARACTER: {
          isAnimatingRef.current = true;
          await mgr.sequence([
            () => spotlightAnimation(mgr, backgroundRef, windowWidth, windowHeight, introText(windowWidth, windowHeight),
                    player(windowWidth, windowHeight), SPOTLIGHT_DURATION)
          ]);
          isAnimatingRef.current = false;
          drawBackground(backgroundRef, windowWidth, windowHeight);
          setKeyControl(Pages.CHARACTER);
          return;
        }

        case PageOrder.SCORES: {
          await mgr.sequence([
            () => spotlightAnimation(mgr, backgroundRef, windowWidth, windowHeight, player(windowWidth, windowHeight),
                    scores(windowWidth, windowHeight), SPOTLIGHT_DURATION)
          ]);
          drawBackground(backgroundRef, windowWidth, windowHeight);
          setKeyControl(Pages.SCORES);

          return;
        }

        case PageOrder.PHONE: {

          isAnimatingRef.current = true;
          await mgr.sequence([
            () => spotlightAnimation(mgr, backgroundRef, windowWidth, windowHeight, scores(windowWidth, windowHeight),
                    phone(windowWidth, windowHeight), SPOTLIGHT_DURATION*1.5)
          ]);
          isAnimatingRef.current = false;
          drawBackground(backgroundRef, windowWidth, windowHeight);
          setKeyControl(Pages.SMARTPHONE)

          return;
        }

        case PageOrder.DECISION: {
          drawBackground(backgroundRef, windowWidth, windowHeight);
          setKeyControl(Pages.DECISION);
          return;
        }
        case PageOrder.MORE_EXPL: {

          isAnimatingRef.current = true;
          await mgr.sequence([
            () => spotlightAnimation(mgr, backgroundRef, windowWidth, windowHeight, player(windowWidth, windowHeight),
                    tv(windowWidth, windowHeight), SPOTLIGHT_DURATION)
          ]);
          isAnimatingRef.current = false;
          drawBackground(backgroundRef, windowWidth, windowHeight);
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
          drawBackground(backgroundRef, windowWidth, windowHeight);

          characterPositionStore.teleport({x: 5*TILE_SIZE, y: 3*TILE_SIZE});
          isAnimatingRef.current = true;
          await mgr.sequence([
            () => spotlightAnimation(mgr, backgroundRef, windowWidth, windowHeight, tv2(windowWidth, windowHeight),
                    scores(windowWidth, windowHeight), SPOTLIGHT_DURATION*1.5)
          ]);
          isAnimatingRef.current = false;
          drawBackground(backgroundRef, windowWidth, windowHeight);

          const bg = backgroundRef.current;
          if (!bg) return;
          bg.clear();

          setKeyControl(Pages.SCORE_CHANGES);
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
  }, [nextPage]);



  //listen for smartTvDone
  useEffect(() => {
    const devices = gameService.getDeviceForRoom(RoomNames.LIVINGROOM);
    const tv = devices.find(d => d.name === "SmartTv");

    if (!tv) return;

    const unsubscribe = tv.subscribe(device => {
      if (device.getIsCompleted() && nextPage === PageOrder.LESS_EXPL) {
        setNextPage(PageOrder.SCORE_CHANGES);
      }
    });

    return () => unsubscribe();
  }, [nextPage, gameService]);


  const background = () => {
    return (
            <>
              <Graphics ref={backgroundRef} />
            </>
    )
  }

  return (
      <>
        {background()}
        <Container ref={rootRef}/>
        {ActivePage && <ActivePage key={keyControl} {...commonProps} />}
      </>
  )
};