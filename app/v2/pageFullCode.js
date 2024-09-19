'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stage, Layer, Image, Rect, Text } from 'react-konva';
import useImage from 'use-image';
import { menuButtonV2 as menuButton } from '@/utils/coordinates';

// Function to create table data with a header
const createTableData = (rows, columns) => {
    const header = [];
    const data = [];

    // Create header row
    for (let col = 0; col < columns; col++) {
        header.push(`Header ${col + 1}`);
    }

    // Create regular data rows
    for (let row = 0; row < rows; row++) {
        const rowData = [];
        for (let col = 0; col < columns; col++) {
            rowData.push(`Cell ${row + 1}-${col + 1}`);
        }
        data.push(rowData);
    }

    return { header, data };
};

export default function Page() {
    const router = useRouter();
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: 0 });
    const [image] = useImage('/v2/donggi/alarm.png');
    const [imgAspectRatio, setImgAspectRatio] = useState(1); // Default aspect ratio
    const { header, data: tableData } = createTableData(5, 4); // Example: 5 rows and 4 columns for the table

    useEffect(() => {
        const resizeCanvas = () => {
            if (!image) return;

            const canvasWidth = window.innerWidth;
            const aspectRatio = image.width / image.height;
            const canvasHeight = canvasWidth / aspectRatio;
            setCanvasSize({ width: canvasWidth, height: canvasHeight });
            setImgAspectRatio(aspectRatio);
        };

        window.addEventListener('resize', resizeCanvas);
        if (image) resizeCanvas(); // Call initially when the image loads

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [image]);

    const handleButtonClick = (button) => {
        router.push(button.href);
    };

    // Table properties
    const cellWidth = 200; // Adjust cell width as needed
    const cellHeight = 50; // Adjust cell height as needed
    const tableWidth = header.length * cellWidth; // Total table width based on number of columns

    // Calculate the horizontal position to center the table
    const tableX = (canvasSize.width - tableWidth) / 2;
    const tableY = (canvasSize.height - (tableData.length + 1) * cellHeight) / 2; // +1 for the header row

    return (
        <div style={{ width: '100%', minHeight: '100vh', overflowY: 'auto', overflowX: 'auto' }}>
            <Stage width={canvasSize.width} height={canvasSize.height}>
                <Layer>
                    {/* Render the background image */}
                    {image && (
                        <Image
                            image={image}
                            x={0}
                            y={0}
                            width={canvasSize.width}
                            height={canvasSize.height}
                        />
                    )}

                    {/* Render buttons */}
                    {menuButton.map((button, index) => {
                        const btnX = button.x * canvasSize.width;
                        const btnY = button.y * canvasSize.height;
                        const btnWidth = button.width * canvasSize.width;
                        const btnHeight = button.height * canvasSize.height;

                        return (
                            <Rect
                                key={index}
                                x={btnX}
                                y={btnY}
                                width={btnWidth}
                                height={btnHeight}
                                fill="transparent"
                                stroke="transparent"
                                onClick={() => handleButtonClick(button)}
                                onMouseEnter={(e) => e.target.getStage().container().style.cursor = 'pointer'}
                                onMouseLeave={(e) => e.target.getStage().container().style.cursor = 'default'}
                            />
                        );
                    })}

                    {/* Draw text for table title */}
                    <Text
                        x={canvasSize.width/2}
                        y={canvasSize.height/2 - 20}
                        text={'Sample Title Table'}
                        fontSize={14}
                        fontStyle="bold" // Make the header text bold
                        fill="black"
                    />

                    {/* Render table header */}
                    {header.map((cell, colIndex) => {
                        const x = tableX + colIndex * cellWidth;
                        const y = tableY; // Header at the top of the table

                        return (
                            <React.Fragment key={`header-${colIndex}`}>
                                {/* Draw header cell (rectangles) */}
                                <Rect
                                    x={x}
                                    y={y}
                                    width={cellWidth}
                                    height={cellHeight}
                                    stroke="black"
                                    fill="#d3d3d3" // Different color for the header
                                />

                                {/* Draw text inside the header cell */}
                                <Text
                                    x={x + 10}
                                    y={y + 15}
                                    text={cell}
                                    fontSize={14}
                                    fontStyle="bold" // Make the header text bold
                                    fill="black"
                                />
                            </React.Fragment>
                        );
                    })}

                    {/* Render table body */}
                    {tableData.map((rowData, rowIndex) =>
                        rowData.map((cell, colIndex) => {
                            const x = tableX + colIndex * cellWidth;
                            const y = tableY + (rowIndex + 1) * cellHeight; // +1 for the header row

                            return (
                                <React.Fragment key={`${rowIndex}-${colIndex}`}>
                                    {/* Draw table cell (rectangles) */}
                                    <Rect
                                        x={x}
                                        y={y}
                                        width={cellWidth}
                                        height={cellHeight}
                                        stroke="black"
                                        fill={rowIndex % 2 === 0 ? '#f0f0f0' : '#ffffff'} // alternating row color
                                    />

                                    {/* Draw text inside the cell */}
                                    <Text
                                        x={x + 10}
                                        y={y + 15}
                                        text={cell}
                                        fontSize={14}
                                        fill="black"
                                    />
                                </React.Fragment>
                            );
                        })
                    )}
                </Layer>
            </Stage>
        </div>
    );
}
