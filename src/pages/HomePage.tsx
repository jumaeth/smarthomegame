import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

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
              <button
                      onClick={() => navigate("/intro")}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                Spiel starten
              </button>
              <button
                      onClick={() => navigate("/game/livingroom")}
                      className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition"
              >
                Intro überspringen und direkt ins Spiel
              </button>
            </div>
          </div>
  );
}