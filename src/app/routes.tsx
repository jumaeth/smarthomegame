import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {FirstFloor} from '../components/FirstFloor.tsx';
import {LivingRoom} from '../components/LivingRoom.tsx';
import {GameOver} from '../components/GameOver';
import {GameWrapper} from "../components/GameWrapper.tsx";
import {FloorSelector} from "../components/FloorSelector.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import HomePage from "../pages/HomePage.tsx";
import {Kitchen} from "@/components/Kitchen.tsx";
import {IntroPage} from "@/pages/IntroPage.tsx";

const AppRoutes = () => (
        <Router>
          <Routes>
            <Route index element={<HomePage/>}/>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/intro" element={<IntroPage/>}/>
            <Route path="/game" element={<GameWrapper/>}>
              <Route index element={<FloorSelector/>}/>
              <Route path="livingroom" element={<LivingRoom/>}/>
              <Route path="kitchen" element={<Kitchen/>}/>
              <Route path="game-over" element={<GameOver/>}/>
              <Route path="first-floor" element={<FirstFloor/>}/>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
);

export default AppRoutes;