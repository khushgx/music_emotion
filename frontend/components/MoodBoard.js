import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const CanvasWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
`;

const ColorPalette = styled.div`
    display: flex;
    margin-bottom: 10px;
`;

const ColorBox = styled.div`
    width: 25px;
    height: 25px;
    margin: 5px;
    cursor: pointer;
    border: ${props => (props.active ? '2px solid black' : 'none')};
`;

const MoodBoard = React.forwardRef((props, ref) => {
    const [isPainting, setIsPainting] = useState(false);
    const [currentColor, setCurrentColor] = useState('#FF5733');
    const canvasRef = useRef(null);
    const colors = [
        '#FF5733', 
        '#33FF57', 
        '#3357FF',
        '#FFFF00',
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 500;
        canvas.height = 500;
    }, []);

    const startPainting = (event) => {
        setIsPainting(true);
        paint(event);
    };

    const endPainting = () => {
        setIsPainting(false);
        canvasRef.current.getContext('2d').beginPath();
    };

    const paint = (event) => {
        if (isPainting) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = currentColor;
            ctx.lineJoin = 'round';
            ctx.lineWidth = 5;

            const x = event.clientX - canvas.offsetLeft;
            const y = event.clientY - canvas.offsetTop;
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    if (ref) {
        ref.current = canvasRef.current;
    }

    return (
        <CanvasWrapper>
            <ColorPalette>
                {colors.map(color => (
                    <ColorBox 
                        key={color}
                        style={{ backgroundColor: color }}
                        active={currentColor === color}
                        onClick={() => setCurrentColor(color)}
                    />
                ))}
            </ColorPalette>

            <canvas
                ref={canvasRef}
                onMouseDown={startPainting}
                onMouseUp={endPainting}
                onMouseMove={paint}
                style={{border: '1px solid #000'}}
            />
        </CanvasWrapper>
    );
});

export default MoodBoard;
