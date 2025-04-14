import { Link } from "react-router-dom";

export default function HomePage() {
  return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-purple-800 text-white p-8">
            <h1 className="text-5xl font-bold mb-6">Welcome to My Game</h1>
            <p className="text-xl text-gray-200 mb-8">Get ready for an awesome adventure!</p>
            <div className="flex space-x-4">
              <Link
                      to="/play"
                      className="px-8 py-4 bg-green-500 hover:bg-green-600 rounded-2xl text-lg font-semibold transition"
              >
                Play Now
              </Link>
              <Link
                      to="/about"
                      className="px-8 py-4 bg-gray-700 hover:bg-gray-800 rounded-2xl text-lg font-semibold transition"
              >
                About
              </Link>
            </div>
          </div>
  );
}
