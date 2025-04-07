import {SmartDevice} from "./SmartDevice.tsx";
import { Link } from 'react-router-dom';

export const SmartTv = () => {
    const smartDeviceTv = new SmartDevice("Smart TV",["Möchtest du die Spracherkennung aktivieren?", "Möchtest du die Kamera aktivieren?"]);
    return (
        <div>
        <h1>
            {smartDeviceTv.name} Mission
        </h1>
        <h3>
            beantworte die folgenden Fragen ...
        </h3>
        <ul>
            {smartDeviceTv.getQuestions()}
        </ul>
        <Link to="/living-room">
            <button>Zurück</button>
        </Link>
        </div>
    );
};
