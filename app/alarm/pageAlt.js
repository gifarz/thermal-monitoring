'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stage, Layer, Image, Rect, Text } from 'react-konva';
import useImage from 'use-image';
import { menuButton } from '@/utils/coordinates';

export default function Page() {
    const router = useRouter();
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [image] = useImage('/v2/donggi/alarm.png');
    const cellWidth = 100;
    const cellHeight = 40;
    const startX = 50;
    const startY = 50;
    const [tableData, setTableData] = useState([
        ['Header 1', 'Header 2', 'Header 3'],
        ['Row 1, Col 1', 'Row 1, Col 2', 'Row 1, Col 3'],
        ['Row 2, Col 1', 'Row 2, Col 2', 'Row 2, Col 3'],
    ]);

    useEffect(() => {
        const resizeCanvas = () => {
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', resizeCanvas);

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const handleClick = (button) => {
        router.push(button.href);  // Navigate to the respective page without a full refresh
    };

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <Stage width={canvasSize.width} height={canvasSize.height}>
                <Layer>
                    {/* Draw background image */}
                    {image && (
                        <Image
                            image={image}
                            x={0}
                            y={0}
                            width={canvasSize.width}
                            height={canvasSize.height}
                        />
                    )}
                    {tableData.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <React.Fragment key={`${rowIndex}-${colIndex}`}>
                                <Rect
                                    x={startX + colIndex * cellWidth}
                                    y={startY + rowIndex * cellHeight}
                                    width={cellWidth}
                                    height={cellHeight}
                                    stroke="black"
                                />
                                <Text
                                    x={startX + colIndex * cellWidth + cellWidth / 2}
                                    y={startY + rowIndex * cellHeight + cellHeight / 2}
                                    text={cell}
                                    align="center"
                                    verticalAlign="middle"
                                />
                            </React.Fragment>
                        ))
                    )}
                    {/* Draw buttons */}
                    {menuButton.map((button, index) => {
                        const btnX = button.x * canvasSize.width;
                        const btnY = button.y * canvasSize.height;
                        const btnWidth = button.width * canvasSize.width;
                        const btnHeight = button.height * canvasSize.height;

                        return (
                            <React.Fragment key={index}>
                                <Rect
                                    x={btnX}
                                    y={btnY}
                                    width={btnWidth}
                                    height={btnHeight}
                                    fill="transparent"
                                    stroke="transparent"
                                    onClick={() => handleClick(button)}
                                />
                                <Text
                                    text={button.label}
                                    x={btnX + btnWidth / 2}
                                    y={btnY + btnHeight / 2}
                                    fontSize={btnHeight * 0.5}
                                    fill="white"
                                    align="center"
                                    verticalAlign="middle"
                                />
                            </React.Fragment>
                        );
                    })}
                </Layer>
            </Stage>
        </div>
    );
}
