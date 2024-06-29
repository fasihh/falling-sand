import '../styles/FallingSand.css';
import { ReactNode, SyntheticEvent, useEffect, useRef } from "react";

type PropsType = { width: number, height: number };
const { floor, random }: Math = Math;

const FallingSand = ({ width, height }: PropsType): ReactNode => {
    const [cols, rows]: number[] = [width/10, height/10];
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const gridRef = useRef<boolean[][]>([] as boolean[][]);

    const initGrid = (): void => {
        gridRef.current = Array.from({ length: cols }, () => Array.from({ length: rows }, () => false));
    }
    
    const handleClick = (e: SyntheticEvent) => {
        const { offsetX, offsetY }: Partial<PointerEvent> = e.nativeEvent as PointerEvent;
        const [x, y]: number[] = [floor(offsetX / 10), floor(offsetY / 10)];
        gridRef.current[y][x] = true;
    }

    const draw = (): void => {
        const context = contextRef.current as CanvasRenderingContext2D;
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);
        context.fillStyle = 'black';
        for (let i = 0; i < height/10; ++i)
            for (let j = 0; j < width/10; ++j)
                if (gridRef.current[i][j])
                    context.fillRect(j*10, i*10, 10, 10);
    }

    const update = (): void => {
        for (let i = rows - 1; i >= 0; --i) {
            for (let j = 0; j < cols; ++j) {
                if (!gridRef.current[i][j]) continue;

                if (i < rows-1 && !gridRef.current[i+1][j]) {
                    gridRef.current[i][j] = false;
                    gridRef.current[i+1][j] = true;
                } else if (i < rows-1 && j < cols-1 && j > 0) {
                    const directions: { x: number, y: number }[] = [];
                    
                    if (!gridRef.current[i+1][j+1])
                        directions.push({ x: 1, y: 1 });
                    if (!gridRef.current[i+1][j-1])
                        directions.push({ x: -1, y: 1 });
                    
                    if (directions.length) {
                        const direction: { x: number, y: number } = directions[floor(random() * directions.length)];
                        gridRef.current[i][j] = false;
                        gridRef.current[i+direction.y][j+direction.x] = true;
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (gridRef.current.length === 0)
            initGrid();

        const canvas = canvasRef.current as HTMLCanvasElement;
        contextRef.current = canvas.getContext('2d') as CanvasRenderingContext2D;

        let reqFrame: number = 0;
        const render = (): void => {
            update();
            draw();
            reqFrame = window.requestAnimationFrame(render);
        }
        reqFrame = window.requestAnimationFrame(render);

        return () => window.cancelAnimationFrame(reqFrame);
    }, [height, width]);

    return (
        <canvas onClick={handleClick} ref={canvasRef} width={width} height={height} className="falling-sand" />
    );
}

export default FallingSand;
