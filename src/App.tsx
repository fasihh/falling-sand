import './App.css';
import { ReactNode } from 'react';
import FallingSand from './components/FallingSand';

function App(): ReactNode {
    return (
        <FallingSand width={500} height={500} />
    );
}

export default App;
