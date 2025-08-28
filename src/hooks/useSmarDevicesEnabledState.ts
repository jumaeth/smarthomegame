import {useEffect, useState} from "react";
import {useGameService} from "@/hooks/useGameService";

export function useSmarDevicesEnabledState() {
  const gameService = useGameService();
  const [sdEnabled, setSdEnabled] = useState<boolean>(() => gameService.areSdEnabled());

  useEffect(() => {
    const unsubscribe = gameService.subscribeSdEnabled(setSdEnabled);
    return () => {
      unsubscribe();
    };
  }, [gameService]);

  return sdEnabled;
}
