import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ExampleComponent} from '../components/ExampleComponent';
import {LivingRoom} from '../components/LivingRoom.tsx';
import {GameOver} from '../components/GameOver';
import {Home} from '../components/Home';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/example" element={<ExampleComponent/>}/>
            <Route path="/living-room" element={<LivingRoom/>}/>
            <Route path="/game-over" element={<GameOver/>}/>
            <Route path="/home" element={<Home/>}/>
        </Routes>
    </Router>
);

export default AppRoutes;