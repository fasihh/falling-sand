import '../styles/FallingSand.css';
import { ReactNode, SyntheticEvent, useEffect, useRef } from "react";

type PropsType = { width: number, height: number };
const { floor, random }: Math = Math;

const FallingSand = ({ width, height }: PropsType): ReactNode => {
    const [cols, rows]: number[] = [width/10, height/10];
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const colorRef = useRef<string[][]>([] as string[][]);
    const gridRef = useRef<boolean[][]>([] as boolean[][]);

    const initGrid = (): void => {
        gridRef.current = Array.from({ length: cols }, () => Array.from({ length: rows }, () => false));
        colorRef.current = Array.from({ length: cols }, () => Array.from({ length: rows }, () => ''));
    }

    function* random_color(): Generator<string> {
        const colors: string[] = ['crimson', 'cyan', 'chartreuse', 'darkorange', 'deepskyblue', 'forestgreen', 'salmon', 'skyblue', 'seagreen'];
        while (true) yield colors[floor(random() * colors.length)];
    }
    
    const handleClick = (e: SyntheticEvent) => {
        const { offsetX, offsetY }: Partial<PointerEvent> = e.nativeEvent as PointerEvent;
        const [x, y]: number[] = [floor(offsetX / 10), floor(offsetY / 10)];

        const dirs: { x: number, y: number }[] = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 },
        ];

        const color: string = random_color().next().value;
        for (let dir of dirs) {
            if (dir.x + x < 0 || dir.x + x > cols-1 || dir.y + y < 0 || dir.y + y > rows-1) continue;
            gridRef.current[y + dir.y][x + dir.x] = true;
            colorRef.current[y + dir.y][x + dir.x] = color;
        }
    }

    const draw = (): void => {
        const context = contextRef.current as CanvasRenderingContext2D;
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);
        for (let i = rows-1; i >= 0; --i)
            for (let j = 0; j < cols; ++j)
                if (gridRef.current[i][j]) {
                    context.fillStyle = colorRef.current[i][j];
                    context.fillRect(j*10, i*10, 10, 10);
                }
    }

    const update = (): void => {


        for (let i = rows - 1; i >= 0; --i) {
            for (let j = 0; j < cols; ++j) {
                if (!gridRef.current[i][j]) continue;

                const move = (di: number, dj: number): void => {
                    gridRef.current[i][j] = false;
                    gridRef.current[i+di][j+dj] = true;
                    [colorRef.current[i][j], colorRef.current[i+di][j+dj]] = [colorRef.current[i+di][j+dj], colorRef.current[i][j]]
                }

                if (i < rows-1 && !gridRef.current[i+1][j]) {
                    move(1, 0);
                    continue;
                }

                if (i < rows-1 && j < cols-1 && j > 0) {
                    const directions: { x: number, y: number }[] = [];
                    
                    if (!gridRef.current[i+1][j+1])
                        directions.push({ x: 1, y: 1 });
                    if (!gridRef.current[i+1][j-1])
                        directions.push({ x: -1, y: 1 });
                    
                    if (!directions.length) continue;

                    const direction: { x: number, y: number } = directions[floor(random() * directions.length)];
                    move(direction.y, direction.x);
                    continue;
                }

                if (j === cols-1 && i < rows-1 && !gridRef.current[i+1][j-1]) {
                    move(1, -1)
                    continue;
                }

                if (j === 0 && i < rows - 1 && !gridRef.current[i+1][j+1])
                    move(1, 1);
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
