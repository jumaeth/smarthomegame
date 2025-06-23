import {useGameService} from "../hooks/useGameService.tsx";
import {GameScore} from "@/objects/GameScore.ts";
import {GameService} from "@/services/GameService.ts";
import {t} from '@lingui/core/macro';
import {Trans} from "@lingui/react/macro";
import Button from "@/components/general-ui/Button.tsx";

export function GameOver() {
  const gameService: GameService = useGameService();
  const gameScore: GameScore = gameService.getScore();
  const privacyScore: number = gameScore.getPrivacyScore();
  const comfortScore: number = gameScore.getComfortScore();
  const gameOverMessage: string = (privacyScore >= 50 && comfortScore >= 50) ? t`Gratulation, du hast gewonnen` : t`Schade, du hast verloren`;

  return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">{gameOverMessage}</h2>
              <p><Trans>Du hast folgende Punktzahl erreicht:
                Privatsphäre: </Trans>{privacyScore}<Trans> Bequemlichkeit: </Trans>{comfortScore}</p>
              <Button onClick={() => gameService.reset()}><Trans>Neu Starten</Trans></Button>
            </div>
          </div>
  );
}
