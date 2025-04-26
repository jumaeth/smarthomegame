import {useNavigate} from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
          <>
            <h1> Hallo und willkommen zum Smart Home Escape game </h1>
            <b> Du befindest dich auf der Startseite. Um ein neues Abenteuer zu beginnen klicke auf die Spiel starten
              Schaltfläche. </b>
            <div>
              <button onClick={() => navigate("/game")}>
                Spiel starten
              </button>
            </div>
          </>
  );
};
