import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export function FloorSelector() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/game/first-floor", {replace: true});
  }, [navigate]);

  return null; // Keine UI, da die Umleitung sofort erfolgt
}