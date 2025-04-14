import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ExampleComponent} from '../components/ExampleComponent';
import {SmartTv} from '../components/smart-devices/SmartTv.tsx';
import {LivingRoom} from '../components/LivingRoom.tsx';
import {GameOver} from '../components/GameOver.tsx';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/example" element={<ExampleComponent/>}/>
            <Route path="/game-over" element={<GameOver/>}/>
        </Routes>
    </Router>
);

export default AppRoutes;
