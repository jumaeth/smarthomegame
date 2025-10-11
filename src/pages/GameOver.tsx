import {useGameService} from "../hooks/gameService/useGameService.tsx";
import {GameScore} from "@/objects/GameScore.ts";
import {GameService} from "@/services/GameService.ts";
import {t} from '@lingui/core/macro';
import {Trans} from "@lingui/react/macro";
import Button from "@/components/general-ui/Button.tsx";
import {StatsService} from "@/services/StatsService.ts";
import {FileService} from "@/services/FileService.ts";
import CsvTable from "@/components/CsvTable.tsx";
import React from "react";


export function GameOver() {
  const gameService: GameService = useGameService();
  const statService: StatsService = new StatsService();
  const gameScore: GameScore = gameService.getScore();
  const privacyScore: number = gameScore.getPrivacyScore();
  const comfortScore: number = gameScore.getComfortScore();
  const gameOverMessage: string = (privacyScore >= 50 && comfortScore >= 50) ? t`Gratulation, du hast gewonnen` : t`Too bad, you lost`;
  const csvString: string = statService.generateCsvString(gameService.getGame());

  const downloadStats: void = () => {
    FileService.downloadFile("smart_home_escape_stats", csvString, "csv");
  }
  return (
          <div className="flex items-center justify-center min-h-screen">

            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">{gameOverMessage}</h2>
              <p><Trans>You have achieved the following score:
                Privacy: </Trans>{privacyScore}<Trans> Convenience: </Trans>{comfortScore}</p>
              <Button onClick={() => gameService.reset()}><Trans>Restart</Trans></Button>
              <Button onClick={() => downloadStats()}><Trans>Download</Trans></Button>

              <h2>
                Game Results:
              </h2>

              <CsvTable csvString={csvString}></CsvTable>
            </div>
          </div>
  );
}