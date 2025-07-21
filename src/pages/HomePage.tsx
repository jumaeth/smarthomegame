import {useNavigate} from "react-router-dom";
import {CookieBanner} from "@/components/general-ui/CookieBanner.tsx";
import Button from "@/components/general-ui/Button.tsx";
import {CookieService} from "@/services/CookieService.ts";
import {Trans} from "@lingui/react/macro";
import LanguageSwitcher from "@/components/LanguageSwitcher.tsx";

export default function HomePage() {
  const navigate = useNavigate();

  const saveCookieChoice = (isAccepted: boolean) => {
    CookieService.set("cookieConsent",isAccepted);
  }

  return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-5xl font-bold mb-6 text-center">
              <Trans>
                Hello and welcome to the Smart Home Escape Game
              </Trans>
            </h1>
            <p className="text-xl text-center mb-10">
              <Trans>
                You are on the start page. To start a new adventure, click on the
              </Trans>
              <span className="font-semibold">
                <Trans>
                  Start game
                </Trans>
              </span>
              <Trans>
                Button.
              </Trans>
            </p>
            <div className="flex space-x-4">
              <Button onClick={() => navigate("/intro")}>
                <Trans>
                  Start game
                </Trans>
              </Button>
              <button
                      onClick={() => navigate("/game/livingroom")}
                      className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition"
              >
                <Trans>
                  Skip the intro and jump straight into the game
                </Trans>
              </button>
              <LanguageSwitcher/>

            </div>
            <div className="flex space-x-4 w-[100%] justify-center mt-4 p-5 bg-gray-300 border-t border-b border-solid border-black">
              <CookieBanner onComplete={saveCookieChoice}/>
            </div>
          </div>
  );
}