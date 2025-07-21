import { useNavigate } from "react-router-dom";
import {Trans} from "@lingui/react/macro";
import LanguageSwitcher from "@/components/LanguageSwitcher.tsx";

export default function HomePage() {
  const navigate = useNavigate();

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
              <button
                      onClick={() => navigate("/intro")}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                <Trans>
                  Start game
                </Trans>
              </button>
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
          </div>
  );
}