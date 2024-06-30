import './App.css';
import { ReactNode, useState } from 'react';
import FallingSand from './components/FallingSand';

function App(): ReactNode {
    const [clear, setClear] = useState<boolean>(false);
    const [brushMode, setBrushMode] = useState<number>(1);

    // add button that changes the brushMode

    return (
        <div className='container'>
            <FallingSand 
                width={800}
                height={600}
                brushMode={brushMode}
                clear={clear}
                setClear={setClear}
            />
            <button
                onClick={ () => setClear(prev => !prev) }
                id="clear"
            >
                Clear
            </button>
        </div>
    );
}

export default App;
