import {Component} from "react";
import {Outlet} from "react-router-dom";
import {GameProvider} from "@/context/GameProvider";

export class GameWrapper extends Component {
  render() {
    return (
            <GameProvider>
              <div>
                <Outlet/>
              </div>
            </GameProvider>
    );
  }
}