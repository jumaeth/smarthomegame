import {useEffect, useState} from "react";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";

export function usePauseState() {
  const gameService = useGameService();
  const [paused, setPaused] = useState<boolean>(() => gameService.isPaused());

  useEffect(() => {
    const unsubscribe = gameService.subscribePause(setPaused);
    return () => {
      unsubscribe();
    };
  }, [gameService]);

  return paused;
}
