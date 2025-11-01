// File: `src/pages/GameOver.tsx`
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
            {/* Linke Fläche: Bild als Hintergrund, Overlay füllt die Fläche komplett */}
            <div className="w-full h-auto sm:flex-none sm:h-screen sm:w-[min(calc(100vh*16/9),70vw)] relative overflow-hidden">
              <img
                      src={victoryState?.picture}
                      alt="Illustration"
                      className={`absolute inset-0 w-full h-full object-cover ${showStatsOnRight ? "filter brightness-60 grayscale" : ""}`}
              />

              {showStatsOnRight && (
                      <div className="absolute inset-0 z-20 p-6 bg-black/60 backdrop-blur-sm flex flex-col">
                        <h1 className="text-2xl text-center mb-4 text-white"><Trans>Game Results:</Trans></h1>
                        <div className="w-full flex-1 overflow-auto">
                          <CsvTable csvString={csvString} />
                        </div>
                      </div>
              )}
            </div>

            {/* Rechte Sidebar - dunkles Design, Aktionen in einer Gruppe */}
            <aside className="flex-1 min-h-screen p-6 sm:border-l border-t sm:border-t-0 border-gray-800/30 flex flex-col justify-between bg-gray-900 text-gray-100">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl leading-tight text-gray-100">
                    <Trans>{victoryState?.displayText}</Trans>
                  </h2>

                  <p className="mt-2 text-sm text-gray-300">
                    <Trans>Privacy</Trans>:
                    <span className="ml-2 font-medium text-gray-100">{String(gameScore.getPrivacyLevel() ?? "-")}</span>
                    <span className="mx-2 text-gray-500">·</span>
                    <Trans>Comfort</Trans>:
                    <span className="ml-2 font-medium text-gray-100">{String(gameScore.getComfortLevel() ?? "-")}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <Button onClick={() => setShowStatsOnRight(s => !s)}>
                    <Trans>{showStatsOnRight ? "Hide Statistics" : "Show Statistics"}</Trans>
                  </Button>

                  <Button onClick={downloadStats}>
                    <Trans>Download CSV</Trans>
                  </Button>

                  <Button onClick={() => { gameService.reset(); }}>
                    <Trans>Restart</Trans>
                  </Button>
                </div>
              </div>

              {/* kleiner Footer-Text (keine doppelten Buttons) */}
              <div className="text-xs text-gray-500 mt-6">
                <Trans>Thanks for playing — your progress can be restarted with the Restart button.</Trans>
              </div>
            </aside>
          </div>
  );
}