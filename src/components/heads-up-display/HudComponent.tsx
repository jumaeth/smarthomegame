import { useEffect, useState } from "react";
import ProgressBar from "@/components/general-ui/ProgressBar.tsx";
import {GameService} from "@/services/GameService.ts";

interface HudProps {
  gameService: GameService;
}

export default function HudComponent({ gameService }: HudProps) {
  const [privacyScore, setPrivacyScore] = useState(0);
  const [comfortScore, setComfortScore] = useState(0);

  useEffect(() => {
    const updateScores = () => {
      const score = gameService.getScore();
      setPrivacyScore(score.getPrivacyScore());
      setComfortScore(score.getComfortScore());
    };

    updateScores(); // initial load
    const interval = setInterval(updateScores, 500); // or on-demand if gameService supports listeners

    return () => clearInterval(interval);
  }, [gameService]);

  return (
          <>
            <div className="absolute top-2 right-2 flex flex-col space-y-2 pointer-events-none select-none z-50">
              <ProgressBar iconPath="/src/assets/coins/privacy_coin.png" progress={privacyScore} />
              <ProgressBar iconPath="/src/assets/coins/comfort_coin.png" progress={comfortScore} />
            </div>
          </>
  );
}
