import { Trans } from "@lingui/react/macro";
import {useGameService} from "../hooks/gameService/useGameService.tsx";

export function GameOver() {
  const gameService = useGameService();

  return (
          <div className="GameOverPage">
            <h2><Trans>Congratulations, you have won</Trans></h2>
            <button onClick={() => gameService.reset()}>
              <Trans>Back to Homepage</Trans>
            </button>
          </div>
  );
}
