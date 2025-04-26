import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {FirstFloor} from '../components/FirstFloor.tsx';
import {LivingRoom} from '../components/LivingRoom.tsx';
import {GameOver} from '../components/GameOver';
import {GameWrapper} from "../components/GameWrapper.tsx";
import {FloorSelector} from "../components/FloorSelector.tsx";
import {Home} from '../components/Home';

const AppRoutes = () => (
        <Router>
          <Routes>
            <Route index element={<Home/>}/>
            <Route path="/game" element={<GameWrapper/>}>
              <Route index element={<FloorSelector/>}/>
              <Route path="living-room" element={<LivingRoom/>}/>
              <Route path="game-over" element={<GameOver/>}/>
              <Route path="first-floor" element={<FirstFloor/>}/>
            </Route>
          </Routes>
        </Router>
);

export default AppRoutes;