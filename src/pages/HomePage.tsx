import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CookieBanner } from "@/components/general-ui/CookieBanner.tsx";
import Button from "@/components/general-ui/Button.tsx";
import { CookieService } from "@/services/CookieService.ts";
import { Trans } from "@lingui/react/macro";
import LanguageSwitcher from "@/components/LanguageSwitcher.tsx";
import { tutorialDoneStore } from "@/hooks/gameService/useTutorialActive.ts";
import bgImage from "@/assets/intro/page/welcomepage.png";
import CharacterSelector from "@/components/character/CharacterSelector.tsx";
import BrowserBanner from "@/components/general-ui/BrowserBanner.tsx";
import { isSupportedBrowser } from "@/utils/checkBrowser.tsx";

import logo1 from "@/assets/intro/page/datapro_logo_lungo_linea.png";
import logo2 from "@/assets/intro/page/logo-big-blue.svg";
import { characterPositionStore } from "@/utils/character/characterPosition.ts";

export default function HomePage() {
  const navigate = useNavigate();

  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);
  const [showBrowserBanner, setShowBrowserBanner] = useState<boolean>(false);
  const [isFooterOpen, setIsFooterOpen] = useState<boolean>(false);

  useEffect(() => {
    const consent = CookieService.get("cookieConsent");
    console.log("Consent: " + consent);
    if (consent === null) {
      setShowCookieBanner(true);
    }
  }, []);

  useEffect(() => {
    const consent = CookieService.get("browserAccepted");
    if (consent === null) {
      setShowBrowserBanner(!isSupportedBrowser());
    }
  }, []);

  const saveCookieChoice = (isAccepted: boolean) => {
    CookieService.set("cookieConsent", isAccepted);
    setShowCookieBanner(false);
  }

  const saveBrowserChoice = (isAccepted: boolean) => {
    CookieService.set("browserAccepted", isAccepted);
    setShowBrowserBanner(false);
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}>

      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="z-10 flex flex-col items-center px-4">
        <h1 className="text-5xl font-bold mb-6 text-center">
          <Trans>
            Welcome to the Smart Home Challenge!
          </Trans>
        </h1>
        <p className="text-xl text-center mb-10">
          <Trans>
            Find the smart gadgets, unlock your home!
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
              tutorialDoneStore.set(true);
              characterPositionStore.reset()
              navigate("/game/livingroom");
            }}
            className="px-6 py-3 bg-gray-400 text-gray-800 rounded-lg shadow-md hover:bg-gray-500 transition"
          >
            <Trans>
              Skip the intro and jump straight into the game
            </Trans>
          </Button>
          <LanguageSwitcher />
        </div>
        <CharacterSelector />
      </div>

      {showBrowserBanner && (
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">
          <div className="p-6 bg-white/90 rounded-2xl shadow-xl backdrop-blur-md w-[min(90vw,36rem)] max-w-full">
            <BrowserBanner onComplete={saveBrowserChoice} />
          </div>
        </div>
      )}

      {/* Slide-up footer */}
      <div
        className={
          [
            "fixed bottom-0 left-0 right-0 bg-white text-gray-900",
            "shadow-[0_-4px_10px_rgba(0,0,0,0.4)]",
            "transition-transform duration-300 ease-out",
            "z-20",
            isFooterOpen ? "translate-y-0" : "translate-y-[75%]"
          ].join(" ")
        }
      >
        {/* Toggle tab */}
        <button
          type="button"
          onClick={() => setIsFooterOpen((prev) => !prev)}
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-4 py-1 rounded-t-full shadow-md flex items-center gap-2 text-sm font-medium"
        >
          <span>
            {isFooterOpen ? (
              <Trans>Hide info</Trans>
            ) : (
              <Trans>Legal & info</Trans>
            )}
          </span>
          <span
            className={
              "transform transition-transform duration-300 " +
              (isFooterOpen ? "rotate-180" : "")
            }
          >
            ▲
          </span>
        </button>

        {/* Footer content */}
        <div className="px-6 py-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          {/* Logo DataPro */}
          <div className="flex items-center gap-6">
            <a
              href="https://www.datapro.education/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center"
            >
              <img
                src={logo1}
                alt="DataPro"
                className="h-auto max-h-16 w-auto object-contain"
              />
            </a>
          </div>

          {/* Links EN */}
          <div className="flex flex-col gap-2 text-sm">
            <a
              href="/legal-notice"
              className="underline hover:no-underline"
              target="_blank"
              rel="noreferrer"
            >
              <Trans>Legal Notice</Trans>
            </a>
            <a
              href="/privacy-policy"
              className="underline hover:no-underline"
              target="_blank"
              rel="noreferrer"
            >
              <Trans>Privacy Policy</Trans>
            </a>
          </div>

          {/* Links DE */}
          <div className="flex flex-col gap-2 text-sm">
            <a
              href="/impressum"
              className="underline hover:no-underline"
              target="_blank"
              rel="noreferrer"
            >
              <Trans>Impressum</Trans>
            </a>
            <a
              href="/privacy-policye"
              className="underline hover:no-underline"
              target="_blank"
              rel="noreferrer"
            >
              <Trans>Data Privacy Policy</Trans>
            </a>
          </div>

          {/* Logo PH */}
          <div className="flex items-center gap-6">
            <a
              href="https://www.ph-freiburg.de/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center"
            >
              <img
                src={logo2}
                alt="Pädagogische Hochschule Freiburg"
                className="h-10 w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Cookie banner overlay */}
      {showCookieBanner && !showBrowserBanner && (
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">
          <div className="p-6 bg-white/90 rounded-2xl shadow-xl backdrop-blur-md w-[min(90vw,36rem)] max-w-full">
            <CookieBanner onComplete={saveCookieChoice} />
          </div>
        </div>
      )}
    </div>
  );
}
