import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {FirstFloor} from '../components/FirstFloor.tsx';
import {LivingRoom} from '../components/LivingRoom.tsx';
import {GameOver} from '../components/GameOver';
import {GameWrapper} from "../components/GameWrapper.tsx";

const AppRoutes = () => (
        <Router>
          <Routes>

            <Route path="/game" element={<GameWrapper/>}>
              <Route path="living-room" element={<LivingRoom/>}/>
              <Route path="game-over" element={<GameOver/>}/>
              <Route path="house" element={<FirstFloor/>}/>
            </Route>
          </Routes>
        </Router>
);

export default AppRoutes;