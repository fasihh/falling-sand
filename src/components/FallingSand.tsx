import '../styles/FallingSand.css';
import { ReactNode, SyntheticEvent, useEffect, useRef } from "react";

type PropsType = {
    width: number,
    height: number,
    brushMode: number,
    randomMode: boolean,
    clear: boolean,
    setClear: (value: React.SetStateAction<boolean>) => void,
    setColor: (value: React.SetStateAction<string>) => void
};
type SandCell = { state: boolean, color?: string };
const { floor, random }: Math = Math;

const FallingSand = ({
    width,
    height,
    brushMode,
    randomMode,
    clear,
    setClear,
    setColor,
}: PropsType): ReactNode => {
    const [cols, rows]: number[] = [width/10, height/10];
    const draggingRef = useRef<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const gridRef = useRef<SandCell[][]>([] as SandCell[][]);
    const colorRef = useRef<number>(1);

    const initGrid = (): void => {
        gridRef.current = Array.from({ length: cols },
            () => Array.from({ length: rows },
                () => ({ state: false }) as SandCell
            )
        );
    }

    const generate_color = (): string => {
        if (colorRef.current > 360) colorRef.current = 1;
        if (randomMode) colorRef.current++;
        return `hsl(${colorRef.current}, 100%, 50%)`;
    }
    
    const handleClick = (e: PointerEvent) => {
        const { offsetX, offsetY }: Partial<PointerEvent> = e;
        const [x, y]: number[] = [floor(offsetX / 10), floor(offsetY / 10)];

        let dirs: { x: number, y: number }[] = [
            { x: 0, y: 0 }
        ];

        if (brushMode === 1)
            dirs.push(
                ...[{ x: 1, y: 0 },
                { x: -1, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: -1 },
                { x: 1, y: 1 },
                { x: 1, y: -1 },
                { x: -1, y: 1 },
                { x: -1, y: -1 }]
            );

        const color: string = generate_color();
        setColor(color);
        for (let dir of dirs) {
            if (dir.x + x < 0 || dir.x + x > cols-1 || dir.y + y < 0 || dir.y + y > rows-1) continue;
            gridRef.current[y + dir.y][x + dir.x] = {
                state: true,
                color
            };
        }
    }

    // returns the state inverted
    const stateInv = (cell: SandCell): boolean => !(cell?.state ?? false);

    const draw = (): void => {
        const context = contextRef.current as CanvasRenderingContext2D;
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);
        for (let i = rows-1; i >= 0; --i)
            for (let j = 0; j < cols; ++j)
                if (!stateInv(gridRef.current[i][j])) {
                    context.fillStyle = gridRef.current[i][j]?.color as string;
                    context.fillRect(j*10, i*10, 10, 10);
                }
    }

    const update = (): void => {
        for (let i = rows - 1; i >= 0; --i) {
            for (let j = 0; j < cols; ++j) {
                const move = (di: number, dj: number): void => {
                    [gridRef.current[i][j], gridRef.current[i+di][j+dj]] = [gridRef.current[i+di][j+dj], gridRef.current[i][j]]
                } 

                if (stateInv(gridRef.current[i][j])) continue;


                if (i < rows-1 && stateInv(gridRef.current[i+1][j])) {
                    move(1, 0);
                    continue;
                }

                if (i < rows-1 && j < cols-1 && j > 0) {
                    const directions: { x: number, y: number }[] = [];
                    
                    if (stateInv(gridRef.current[i+1][j+1]))
                        directions.push({ x: 1, y: 1 });
                    if (stateInv(gridRef.current[i+1][j-1]))
                        directions.push({ x: -1, y: 1 });
                    
                    if (!directions.length) continue;

                    const direction: { x: number, y: number } = directions[floor(random() * directions.length)];
                    move(direction.y, direction.x);
                    continue;
                }

                if (j === cols-1 && i < rows-1 && stateInv(gridRef.current[i+1][j-1]))
                    move(1, -1);
                if (j === 0 && i < rows-1 && stateInv(gridRef.current[i+1][j+1]))
                    move(1, 1);
            }
        }
    }

    useEffect(() => {
        if (gridRef.current.length === 0 || clear) {
            initGrid();
            setClear(false);
        }

        const canvas = canvasRef.current as HTMLCanvasElement;
        contextRef.current = canvas.getContext('2d') as CanvasRenderingContext2D;

        let reqFrame: number = 0;
        const render = (): void => {
            reqFrame = window.requestAnimationFrame(render);
            update();
            draw();
        }
        reqFrame = window.requestAnimationFrame(render);

        const handleMouseDown = (): void => {
            draggingRef.current = true;
        };

        const handleMouseUp = (): void => {
            draggingRef.current = false;
        };

        const handleMouseMove = (e: MouseEvent): void => {
            if (!draggingRef.current) return;
            handleClick(e as unknown as PointerEvent);
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.cancelAnimationFrame(reqFrame);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
        }
    }, [height, width, clear, brushMode, randomMode]);

    return (
        <canvas
            ref={canvasRef}
            onClick={(e: SyntheticEvent): void => {
                handleClick(e.nativeEvent as unknown as PointerEvent);
            }}
            width={width} 
            height={height} 
            className="falling-sand" 
        />
    );
}

export default FallingSand;
