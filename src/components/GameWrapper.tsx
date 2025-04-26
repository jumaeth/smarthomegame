import {Component} from "react";
import {Outlet} from "react-router-dom";
import {GameProvider} from "../context/GameContext.tsx";

export class GameWrapper extends Component {
  render() {
    return (
            <GameProvider>
              <div>
                <h1>Running game</h1>
                <Outlet/>
              </div>
            </GameProvider>
    );
  }
}