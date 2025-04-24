import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ExampleComponent} from '../components/ExampleComponent';
import {House} from '../components/House.tsx';
import {LivingRoom} from '../components/LivingRoom.tsx';
import {GameOver} from '../components/GameOver';
import {GameWrapper} from "../components/GameWrapper.tsx";

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/example" element={<ExampleComponent/>}/>
            <Route path="/game" element={<GameWrapper/>}>
                <Route path="example" element={<ExampleComponent/>}/>
                <Route path="game-over" element={<GameOver/>}/>
                <Route path="living-room" element={<LivingRoom/>}/>
            </Route>
            <Route path="/house" element={<House/>}/>
            <Route path="/game-over" element={<GameOver/>}/>
        </Routes>
    </Router>
);

export default AppRoutes;