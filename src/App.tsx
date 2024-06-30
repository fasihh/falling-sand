import './App.css';
import { ReactNode, useState } from 'react';
import FallingSand from './components/FallingSand';

function App(): ReactNode {
    const [clear, setClear] = useState<boolean>(false);
    const [brushMode, setBrushMode] = useState<number>(1);
    const [randomMode, setRandomMode] = useState<boolean>(true);
    const [color, setColor] = useState<string>('');

    // add button that changes the brushMode
    function bushModeCycler(): number {
        switch (brushMode) {
        case 1: return 2;
        case 2: return 1;
        default: return 0;
        }
    }

    return (
        <div className='container'>
            <div className='display'>
                <FallingSand 
                    width={800}
                    height={600}
                    brushMode={brushMode}
                    randomMode={randomMode}
                    clear={clear}
                    setClear={setClear}
                    setColor={setColor}
                />
                <div style={{
                    backgroundColor: color
                }} className='current-color'></div>
            </div>
            <div className="options-container">
                <button
                    onClick={ () => setClear(prev => !prev) }
                    className="options"
                >
                    Clear
                </button>
                <button
                    onClick={ () => setRandomMode(prev => !prev) }
                    className="options"
                >
                    { randomMode ?  'Random' : 
                        <div className="random-button">
                            <div className="fixed" style={{ backgroundColor: color }}></div>
                            <span>Fixed</span>
                        </div>
                    }

                </button>
                <button
                    onClick={ () => setBrushMode(bushModeCycler()) }
                    className="options"
                >
                    Brush {brushMode}
                </button>
            </div>
        </div>
    );
}

export default App;
