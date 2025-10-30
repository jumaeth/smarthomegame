import {useGameService} from "../hooks/gameService/useGameService.tsx";
import {GameScore} from "@/objects/GameScore.ts";
import {GameService} from "@/services/GameService.ts";
import {Trans} from "@lingui/react/macro";
import Button from "@/components/general-ui/Button.tsx";
import {StatsService} from "@/services/StatsService.ts";
import {FileService} from "@/services/FileService.ts";
import CsvTable from "@/components/CsvTable.tsx";
import {VictoryType} from "@/objects/VictoryType.ts";
import {useState} from "react";

export function GameOver() {
  const gameService: GameService = useGameService();
  const statService: StatsService = new StatsService();
  const gameScore: GameScore = gameService.getScore();
  const victoryState: VictoryType | undefined = VictoryType.fromLevels(gameScore.getPrivacyLevel(), gameScore.getComfortLevel());
  const csvString: string = statService.generateCsvString(gameService.getGame());

  const [showStatsOnRight, setShowStatsOnRight] = useState(false);


  function downloadStats(): void {
    FileService.downloadFile("smart_home_escape_stats", csvString, "csv");
  }

  return (
          <div className="min-h-screen flex flex-col sm:flex-row">
            {/* Linke Fläche */}
            <div className="w-full h-auto sm:flex-none sm:h-[95vh] sm:w-[min(calc(95vh*16/9),70vw)] p-6 overflow-auto">
              <div className="flex items-start justify-between gap-4 mb-4">
                {showStatsOnRight ? (
                        <div className="overflow-auto max-h-[60vh] p-2 bg-gray-100 dark:bg-gray-800 rounded">
                          <h2 className="text-2xl"><Trans>Game Results:</Trans></h2>
                          {/* Stats container auf der rechten Seite (wiederverwendet CsvTable) */}
                          <CsvTable csvString={csvString} />
                        </div>
                ) : (
                        <div className="flex justify-center">
                          <img
                                  src={"https://live.staticflickr.com/65535/54884708545_cb48eb51c5_b.jpg"}
                                  alt="Illustration"
                                  className="max-w-full h-auto rounded shadow-sm"
                                  style={{ maxHeight: "60vh" }}
                          />
                        </div>
                )}

              </div>
            </div>

            {/* Rechte Sidebar */}
            <aside className="flex-1 p-6 sm:border-l border-t sm:border-t-0 border-gray-200/10 flex flex-col justify-between">
              <div>
                <p className="mb-4"><Trans>{victoryState?.displayText}</Trans></p>

                <Button onClick={() => setShowStatsOnRight(s => !s)}>
                  <Trans>{showStatsOnRight ? "Hide Stats" : "Show Stats"}</Trans>
                </Button>

                {/* ...restlicher Inhalt falls nötig... */}
              </div>

              <div className="flex gap-3">
                <Button onClick={downloadStats}><Trans>Download CSV</Trans></Button>
                <Button onClick={() => gameService.reset()}><Trans>Restart</Trans></Button>
              </div>
            </aside>
          </div>
  );
}