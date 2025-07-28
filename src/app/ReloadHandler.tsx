import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ReloadHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasHandledReload, setHasHandledReload] = useState(false);

  useEffect(() => {
    // Track current page for future reloads
    const trackPageVisit = () => {
      // Don't track certain pages
      if (location.pathname !== "/game/continue-game") {
        sessionStorage.setItem("lastVisitedPage", location.pathname);
        sessionStorage.setItem("lastVisitedTime", Date.now().toString());
      }
    };

    // Set up page tracking
    trackPageVisit();

    // Set up beforeunload to mark potential reload
    const handleBeforeUnload = () => {
      sessionStorage.setItem("wasReloaded", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (hasHandledReload) return;

    const wasReloaded = sessionStorage.getItem("wasReloaded");
    const lastVisitedPage = sessionStorage.getItem("lastVisitedPage");
    const lastVisitedTime = sessionStorage.getItem("lastVisitedTime");

    // Check if this is actually a reload
    const detectReload = (): boolean => {
      try {
        const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
        if (navEntries.length > 0 && navEntries[0].type === "reload") {
          return true;
        }
      } catch (e) {
        // Fallback detection
        console.log(e);
        return wasReloaded === "true";
      }

      return wasReloaded === "true";
    };

    const isReload = detectReload();
    const timeSinceLastVisit = lastVisitedTime ?
            Date.now() - parseInt(lastVisitedTime) : Infinity;

    console.log("Reload detection:", {
      isReload,
      lastVisitedPage,
      timeSinceLastVisit,
      currentPath: location.pathname
    });

    if (
            isReload &&
            lastVisitedPage &&
            lastVisitedPage == location.pathname &&
            !hasHandledReload
    ) {
        console.log("if entered")
        setHasHandledReload(true);

        // Clear the reload flag
        sessionStorage.removeItem("wasReloaded");

        navigate("/game/continue-game", {
          replace: true,
          state: {
            lastPath: lastVisitedPage,
            reloadDetected: true
          }
        });
      }
  }, [navigate, location.pathname, hasHandledReload]);

  return null;
};

export default ReloadHandler;