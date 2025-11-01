import {useEffect} from "react";
import {useGameService} from "../hooks/gameService/useGameService.tsx";
import {GameService} from "@/services/GameService.ts";
import Button from "@/components/general-ui/Button.tsx";
import {CookieService} from "@/services/CookieService.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {Trans} from "@lingui/react/macro";

export function ContinueGame() {
  const navigate = useNavigate();
  const gameService: GameService = useGameService();

  useEffect(() => {
    if (
            !CookieService.areCookiesAllowed() ||
            CookieService.get("save_game") == null
    ) {
      navigate("/home", {replace: true});
    }
  }, [navigate]);

  const location = useLocation();
  const lastPath = location.state?.lastPath;

  const onNewGame = () => {
    gameService.reset();
    navigate("/home", {replace: true});
  };

  return (
          <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6 text-center">
                <Trans>Welcome back, it looks like you ended the game early.</Trans>
              </h1>
              <p className="text-xl text-center mb-10"><Trans>What do you want to do?</Trans></p>
              <Button onClick={() => navigate(lastPath)}><Trans>Continue saved game</Trans></Button>
              <Button onClick={onNewGame}><Trans>Start a new game</Trans></Button>
            </div>
          </div>
  );
}
