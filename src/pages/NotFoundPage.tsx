import {Link} from "react-router-dom";

export default function NotFoundPage() {
  return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl mb-8 text-gray-400">Page Not Found</p>
            <Link
                    to="/"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg transition"
            >
              Go Home
            </Link>
          </div>
  );
}
