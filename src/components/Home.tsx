import GameService from "./GameService.tsx";

export const Home = () => {

  return (
          <>
            <h1> Hallo und wilkommen zum Smart Home Escape game </h1>
            <b> Du befindest dich auf der Startseite. Um ein neues Abenteuer zu beginnen clicke auf die Spiel starten
              Schaltfläche. </b>
            <div>
              <button onClick={() => GameService.startGame()}>
                Spiel starten
              </button>
            </div>
          </>
  );
};
