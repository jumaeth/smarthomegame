import { Link } from 'react-router-dom';

export const LivingRoom = () => {
    return (
        <div>
            <h1>
                LivingRoom
            </h1>
            <Link to="/smart-devices/smart-tv">
                <button>Smart TV öffnen</button>
            </Link>
        </div>
    );
};