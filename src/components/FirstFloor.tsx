import {Room} from "../objects/Room.ts";
import {GameService} from "../services/GameService.ts";

export function FirstFloor() {
  const gameService = new GameService;

  const createRoomButton = (name: string, url: string, completed: boolean) => {
    const backgroundColor = completed ? 'green' : 'red';
    return (
            <div className="button-wrapper">
              <a className="button-link" href={`${url}`} style={{backgroundColor}}>
                {name}
              </a>
            </div>
    );
  };
  const buttons = gameService.getRooms().map((room: Room) =>
          createRoomButton(room.name, room.url, room.completed)
  );
  return (
          <div className="House">
            <h2>Haus</h2>
            <h4>Übersicht über deinem Smart Home</h4>
            {buttons}
          </div>
  )
}