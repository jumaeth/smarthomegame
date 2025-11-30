import { useEffect } from "react";
import Button from "@/components/general-ui/Button.tsx";
import { CookieService } from "@/services/CookieService.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { Trans } from "@lingui/react/macro";
import { characterPositionStore } from "@/utils/character/characterPosition.ts";
import { tutorialDoneStore } from "@/hooks/gameService/useTutorialActive.ts";

export function ContinueGame() {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !CookieService.areCookiesAllowed() ||
      CookieService.get("save_game") == null
    ) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const location = useLocation();
  const lastPath = location.state?.lastPath;

  const onNewGame = () => {
    CookieService.set("save_game", null);
    CookieService.set("save_player_position", null);
    CookieService.set("save_player_facing", null);
    CookieService.set("tutorialState", null);
    tutorialDoneStore.set(false)
    characterPositionStore.reset()
    navigate("/home", { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6 text-center">
          <Trans>Welcome back — it looks like you quit the game early.</Trans>
        </h1>
        <p className="text-xl text-center mb-10"><Trans>What do you want to do?</Trans></p>
        <Button onClick={() => navigate(lastPath)}><Trans>Continue your previously saved game</Trans></Button>
        <Button onClick={onNewGame}><Trans>Start a new game</Trans></Button>
      </div>
    </div>
  );
}