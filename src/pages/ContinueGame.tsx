import {useEffect} from "react";
import {useGameService} from "../hooks/useGameService.tsx";
import {GameService} from "@/services/GameService.ts";
import Button from "@/components/general-ui/Button.tsx";
import {CookieService} from "@/services/CookieService.ts";
import {useLocation, useNavigate} from "react-router-dom";

export function ContinueGame() {
  const navigate = useNavigate();
  const gameService: GameService = useGameService();
  console.log("debug -in continueGamePage")

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

  const on_newgame = () => {
    gameService.reset();
    navigate("/home", {replace: true});
  };

  return (
          <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6 text-center">
                Wilkommen zurück, es sieht aus als hättest du das spiel vorzeitig beendet.
              </h1>
              <p className="text-xl text-center mb-10">Was möchtest du tun?</p>
              <Button onClick={() => navigate(lastPath)}>Gespeichertes Spiel fortsetzen</Button>
              <Button onClick={on_newgame}>Ein neues Spiel starten</Button>
            </div>
          </div>
  );
}
