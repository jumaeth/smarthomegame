import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {FirstFloor} from '../components/rooms/FirstFloor.tsx';
import {LivingRoom} from '../components/rooms/LivingRoom.tsx';
import {GameOver} from '../pages/GameOver.tsx';
import {GameWrapper} from "../components/GameWrapper.tsx";
import {FloorSelector} from "../components/FloorSelector.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import HomePage from "../pages/HomePage.tsx";
import {Kitchen} from "@/components/rooms/Kitchen.tsx";
import {IntroPage} from "@/pages/IntroPage.tsx";
import ReloadHandler from "@/app/ReloadHandler.tsx";
import {ContinueGame} from "@/pages/ContinueGame.tsx";

const AppRoutes = () => (
        <Router>
          <ReloadHandler/>
          <Routes>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/intro" element={<IntroPage/>}/>
            <Route path="/game" element={<GameWrapper/>}>
              <Route index element={<FloorSelector/>}/>
              <Route path="livingroom" element={<LivingRoom/>}/>
              <Route path="kitchen" element={<Kitchen/>}/>
              <Route path="game-over" element={<GameOver/>}/>
              <Route path="continue-game" element={<ContinueGame/>}/>
              <Route path="first-floor" element={<FirstFloor/>}/>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
);

export default AppRoutes;