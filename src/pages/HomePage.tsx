import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {CookieBanner} from "@/components/general-ui/CookieBanner.tsx";
import Button from "@/components/general-ui/Button.tsx";
import {CookieService} from "@/services/CookieService.ts";
import {Trans} from "@lingui/react/macro";
import LanguageSwitcher from "@/components/LanguageSwitcher.tsx";
import bgImage from "@/assets/intro/page/welcomepage.jpeg";
import {tutorialActiveStore} from "@/hooks/gameService/useTutorialActive.ts";
import CharacterSelector from "@/components/character/CharacterSelector.tsx";

export default function HomePage() {
  const navigate = useNavigate();

  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    const consent = CookieService.get("cookieConsent");
    console.log("Consent: " + consent);
    if (consent === null) {
      setShowBanner(true);
    }
  }, []);

  const saveCookieChoice = (isAccepted: boolean) => {
    CookieService.set("cookieConsent", isAccepted);
    setShowBanner(false);
  }

  return (
          <div className="relative flex flex-col items-center justify-center min-h-screen text-white bg-cover bg-center"
               style={{backgroundImage: `url(${bgImage})`}}>

            <div className="absolute inset-0 bg-black/40 z-0"/>

            <div className="z-10 flex flex-col items-center px-4">
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
                <Button
                        onClick={() => {
                          tutorialActiveStore.set(false);
                          navigate("/game/livingroom");
                        }}
                        className="px-6 py-3 bg-gray-400 text-gray-800 rounded-lg shadow-md hover:bg-gray-500 transition"
                >
                  <Trans>
                    Skip the intro and jump straight into the game
                  </Trans>
                </Button>
                <LanguageSwitcher/>
              </div>
              <CharacterSelector/>
            </div>

            {showBanner && (
                    <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">
                      <div className="p-6 bg-white/90 rounded-2xl shadow-xl backdrop-blur-md w-[min(90vw,36rem)] max-w-full">
                        <CookieBanner onComplete={saveCookieChoice}/>
                      </div>
                    </div>
            )}
          </div>
  );
}