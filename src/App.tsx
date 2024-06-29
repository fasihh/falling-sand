import './App.css';
import { ReactNode } from 'react';
import FallingSand from './components/FallingSand';

function App(): ReactNode {
    return (
        <FallingSand width={1920} height={1050} />
    );
}

export default App;
