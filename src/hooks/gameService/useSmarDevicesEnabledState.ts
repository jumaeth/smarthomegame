import {useEffect, useState} from "react";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";

export function useSmarDevicesEnabledState() {
  const gameService = useGameService();
  const [sdEnabled, setSdEnabled] = useState<boolean>(() => gameService.areSmartDevicesEnabled());

  useEffect(() => {
    const unsubscribe = gameService.subscribeSmartDevicesEnabled(setSdEnabled);
    return () => {
      unsubscribe();
    };
  }, [gameService]);

  return sdEnabled;
}