import {useNavigate} from "react-router-dom";
import {CookieBanner} from "@/components/general-ui/CookieBanner.tsx";
import Button from "@/components/general-ui/Button.tsx";
import {CookieService} from "@/services/CookieService.ts";

export default function HomePage() {
  const navigate = useNavigate();

  const saveCookieChoice = (isAccepted: boolean) => {
    CookieService.set("cookieConsent",isAccepted);
  }

  return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-5xl font-bold mb-6 text-center">
              Hallo und willkommen zum Smart Home Escape Game
            </h1>
            <p className="text-xl text-center mb-10">
              Du befindest dich auf der Startseite. Um ein neues Abenteuer zu beginnen, klicke auf die
              <span className="font-semibold"> Spiel starten </span> Schaltfläche.
            </p>
            <div className="flex space-x-4">
              <Button onClick={() => navigate("/intro")}>Start game</Button>
              <button
                      onClick={() => navigate("/game/livingroom")}
                      className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition"
              >
                Intro überspringen und direkt ins Spiel
              </button>

            </div>
            <div className="flex space-x-4 w-[100%] justify-center mt-4 p-5 bg-gray-300 border-t border-b border-solid border-black">
              <CookieBanner onComplete={saveCookieChoice}/>
            </div>
          </div>
  );
}