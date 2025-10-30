import {useGameService} from "../hooks/gameService/useGameService.tsx";
import {GameScore} from "@/objects/GameScore.ts";
import {GameService} from "@/services/GameService.ts";
import {t} from '@lingui/core/macro';
import {Trans} from "@lingui/react/macro";
import Button from "@/components/general-ui/Button.tsx";
import bgImageWon from "@/assets/victory-page/game_won.png";
import bgImageLost from "@/assets/victory-page/game_lost.png";
import {StatsService} from "@/services/StatsService.ts";
import {FileService} from "@/services/FileService.ts";
import CsvTable from "@/components/CsvTable.tsx";


export function GameOver() {
  const gameService: GameService = useGameService();
  const statService: StatsService = new StatsService();
  const gameScore: GameScore = gameService.getScore();
  const privacyScore: number = gameScore.getPrivacyScore();
  const comfortScore: number = gameScore.getComfortScore();
  const gameOverMessage: string = (privacyScore >= 50 && comfortScore >= 50) ? t`Congratulations, you won!` : t`Too bad, you lost`;
  const bgImage = (privacyScore >= 50 && comfortScore >= 50) ? bgImageWon : bgImageLost;
  const csvString: string = statService.generateCsvString(gameService.getGame());

  function downloadStats(): void {
    FileService.downloadFile("smart_home_escape_stats", csvString, "csv");
  }

  return (
          <div className="flex items-center justify-center h-screen w-screen bg-black">
            <div className="relative w-full h-full max-w-[150vh] max-h-[66.67vw] bg-contain bg-center"
                 style={{backgroundImage: `url(${bgImage})`}}>
              <div className="absolute top-[5%] right-0 w-full h-min">
                <h2 className="text-2xl font-bold mb-4 text-center">{gameOverMessage}</h2>
              </div>
              <div className="absolute top-[70%] right-[30%] w-[40%] max-h-[17%] text-center p-4">
                <p className="text-sm"><Trans>You have achieved the following score <br/>Privacy: </Trans>{privacyScore}<Trans> Convenience: </Trans>{comfortScore}
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-min h-min">
                <Button onClick={() => gameService.reset()}><Trans>Restart</Trans></Button>
                <Button onClick={() => downloadStats()}><Trans>Download</Trans></Button>
              </div>

              <h2><Trans>
                Game Results:
              </Trans></h2>

              <CsvTable csvString={csvString}></CsvTable>
            </div>
          </div>
  );
}