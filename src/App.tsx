import './App.css';
import { ReactNode, useState } from 'react';
import FallingSand from './components/FallingSand';

function App(): ReactNode {
    const [clear, setClear] = useState<boolean>(false);
    const [brushMode, setBrushMode] = useState<number>(1);
    const [randomMode, setRandomMode] = useState<boolean>(true);
    const [freezeMode, setFreezeMode] = useState<boolean>(false);
    const [eraseMode, setEraseMode] = useState<boolean>(false);
    const [color, setColor] = useState<number>(1);
    const [save, setSave] = useState<boolean>(false);
    const [pixelSize, setPixelSize] = useState<number>(2);

    // add button that changes the brushMode
    function bushModeCycler(): number {
        switch (brushMode) {
        case 1: return 2;
        case 2: return 3;
        case 3: return 4;
        case 4: return 5;
        case 5: return 6;
        case 6: return 1;
        default: return 0;
        }
    }

    function pixelSizeCycler(): number {
        switch (pixelSize) {
            case 2: return 5;
            case 5: return 10;
            case 10: return 20;
            case 20: return 2;
            default: return 0;
        }
    }

    return (
        <div className='container'>
            <div className='display'>
                <FallingSand
                    width={800}
                    height={600}
                    pixelSize={pixelSize}
                    brushMode={brushMode}
                    randomMode={randomMode}
                    freezeMode={freezeMode}
                    eraseMode={eraseMode}
                    clear={clear}
                    save={save}
                    setClear={setClear}
                    setColor={setColor}
                    setSave={setSave}
                />
                <div className='current-color-wrapper'>
                    <span>Current Color</span>
                    <div style={{
                        backgroundColor: `hsl(${color}, 100%, 50%)`
                    }} className='current-color'></div>
                </div>
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
                            <div className="fixed" style={{ backgroundColor: `hsl(${color}, 100%, 50%)` }}></div>
                            <span>Fixed</span>
                        </div>
                    }

                </button>
                <button
                    onClick={ () => setFreezeMode(prev => !prev) }
                    className="options"
                >
                    { freezeMode ? 'Unfreeze' : 'Freeze' }
                </button>
                <button
                    onClick={ () => setBrushMode(bushModeCycler()) }
                    className="options"
                >
                    Brush {brushMode}
                </button>
                <button
                    onClick={ () => setEraseMode(prev => !prev) }
                    className="options"
                >
                    { eraseMode ? 'Draw' : 'Erase' }
                </button>
                <button
                    onClick={ () => setSave(true) }
                    className="options"
                >
                    Export
                </button>
                <button
                    onClick={ () => setPixelSize(pixelSizeCycler()) }
                    className="options"
                >
                    Pixel Size {pixelSize}
                </button>
            </div>
        </div>
    );
}

export default App;
