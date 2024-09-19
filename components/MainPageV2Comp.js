import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stage, Layer, Image, Rect, Text } from 'react-konva';
import useImage from 'use-image';
import { menuButtonV2 as menuButton, panelButtonDonggiV2 as panelButtonDonggi } from '@/utils/coordinates';

export default function MainPageV2Comp(param) {

    const router = useRouter();
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: 0 });
    const [image] = useImage(`${param.path}.png`);
    const [imgAspectRatio, setImgAspectRatio] = useState(1); // Default aspect ratio
    const [startDate, setStartDate] = useState('Start Date');
    const [endDate, setEndDate] = useState('End Date');

    const pageName = param.path.split('/')[3] // filtering only for the page that exist

    const headerTable = ['ID', 'TIMESTAMP', 'ALARMID', 'STATUS']
    const bodyTable = param.trending

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

    const handleStartDateClick = () => {
        const selectedDate = prompt('Enter start date (YYYY-MM-DD)', '2024-09-15'); // Simulate date input
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    const handleEndDateClick = () => {
        const selectedDate = prompt('Enter end date (YYYY-MM-DD)', '2024-09-15'); // Simulate date input
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    // Function to convert table data to CSV and trigger a download
    const handleExportToCSV = () => {
        const csvRows = [];

        // Add table headers
        csvRows.push(headerTable.join(','));

        // Add table body data
        bodyTable.forEach(row => {
            const values = Object.values(row).map(value => String(value)); // Convert BigInt to string
            csvRows.push(values.join(','));
        });

        // Create CSV string
        const csvString = csvRows.join('\n');

        // Create a Blob and download the CSV file
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'table_data.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Positions and dimensions for the date range pickers
    const topButtonWidth = 120;
    const topButtonHeight = 50;
    const topButtonX = (canvasSize.width / 2); // X Position Top Button
    const topButtonY = (canvasSize.height / 2) - 160; // Top margin for the Button Top

    // Table properties
    const cellWidth = 200; // Adjust cell width as needed
    const cellHeight = 50; // Adjust cell height as needed
    const tableWidth = headerTable.length * cellWidth; // Total table width based on number of columns

    // Calculate the horizontal position to center the table
    const tableX = (canvasSize.width - tableWidth) / 2;
    const tableY = ((canvasSize.height - (bodyTable?.length + 1) * cellHeight) / 2) + 50; // +1 for the header row

    return (
        <div style={{ width: '100%', minHeight: '100vh', overflowY: 'auto', overflowX: 'auto' }}>
            <Stage width={canvasSize.width} height={canvasSize.height}>
                <Layer>
                    {/* Render the background image */}
                    {
                        image && (
                            <Image
                                image={image}
                                x={0}
                                y={0}
                                width={canvasSize.width}
                                height={canvasSize.height}
                            />
                        )
                    }

                    {/* Render buttons */}
                    {
                        menuButton.map((button, index) => {
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
                        })
                    }

                    {
                        pageName == 'overview' ?
                            <>
                                {/* Render panels */}
                                {panelButtonDonggi.map((button, index) => {
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
                            </>
                            :
                            ''
                    }

                    {
                        pageName == 'trending' ?
                            <>
                                {/* Button to export table data to CSV */}
                                <React.Fragment>
                                    {/* Start Date Picker */}
                                    <Rect
                                        x={topButtonX - 400}
                                        y={topButtonY}
                                        width={topButtonWidth}
                                        height={topButtonHeight}
                                        stroke="black"
                                        fill="#d3d3d3" // Light blue color
                                        cornerRadius={10}
                                        onClick={handleStartDateClick} // Simulate date selection on click
                                        onMouseEnter={(e) => e.target.getStage().container().style.cursor = 'pointer'}
                                        onMouseLeave={(e) => e.target.getStage().container().style.cursor = 'default'}
                                    />
                                    <Text
                                        x={topButtonX - 400 + 25}
                                        y={topButtonY + 17}
                                        text={startDate}
                                        fontSize={14}
                                        fill="black"
                                        fontStyle="bold" // Make the text bold
                                        onMouseEnter={(e) => e.target.getStage().container().style.cursor = 'pointer'}
                                        onMouseLeave={(e) => e.target.getStage().container().style.cursor = 'default'}
                                    />

                                    {/* End Date Picker */}
                                    <Rect
                                        x={topButtonX - 270}
                                        y={topButtonY}
                                        width={topButtonWidth}
                                        height={topButtonHeight}
                                        stroke="black"
                                        fill="#d3d3d3" // Light blue color
                                        cornerRadius={10}
                                        onClick={handleEndDateClick} // Simulate date selection on click
                                        onMouseEnter={(e) => e.target.getStage().container().style.cursor = 'pointer'}
                                        onMouseLeave={(e) => e.target.getStage().container().style.cursor = 'default'}
                                    />
                                    <Text
                                        x={topButtonX - 270 + 25}
                                        y={topButtonY + 17}
                                        text={endDate}
                                        fontSize={14}
                                        fill="black"
                                        fontStyle="bold" // Make the text bold
                                        onMouseEnter={(e) => e.target.getStage().container().style.cursor = 'pointer'}
                                        onMouseLeave={(e) => e.target.getStage().container().style.cursor = 'default'}
                                    />

                                    {/* Draw Export to CSV Button */}
                                    <Rect
                                        x={topButtonX + 280}
                                        y={topButtonY}
                                        width={topButtonWidth}
                                        height={topButtonHeight}
                                        stroke="black"
                                        fill="#d3d3d3" // Different color for the header
                                        onClick={() => handleExportToCSV()}
                                        onMouseEnter={(e) => e.target.getStage().container().style.cursor = 'pointer'}
                                        onMouseLeave={(e) => e.target.getStage().container().style.cursor = 'default'}
                                        cornerRadius={10}
                                    />

                                    {/* Draw text inside the Export to CSV Button */}
                                    <Text
                                        x={topButtonX + 280 + 12}
                                        y={topButtonY + 17}
                                        text={'Export to CSV'}
                                        fontSize={14}
                                        fontStyle="bold" // Make the text bold
                                        fill="black"
                                        onClick={() => handleExportToCSV()}
                                        onMouseEnter={(e) => e.target.getStage().container().style.cursor = 'pointer'}
                                        onMouseLeave={(e) => e.target.getStage().container().style.cursor = 'default'}
                                    />
                                </React.Fragment>

                                {/* Draw text for table title */}
                                {/* <Text
                                    x={(canvasSize.width / 2) - 100}
                                    y={(canvasSize.height / 2) - 200}
                                    text={'Trending Table Data'}
                                    fontSize={25}
                                    fontStyle="bold" // Make the header text bold
                                    fill="black"
                                /> */}

                                {/* Render table header */}
                                {
                                    headerTable.map((cell, colIndex) => {
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
                                    })
                                }

                                {/* Render table body */}
                                {
                                    bodyTable.map((rowData, rowIndex) =>
                                        Object.values(rowData).map((value, colIndex) => {
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
                                                        text={String(value)} // Convert BigInt to string if necessary
                                                        fontSize={14}
                                                        fill="black"
                                                    />
                                                </React.Fragment>
                                            );
                                        })
                                    )
                                }

                            </>
                            :
                            ''
                    }
                </Layer>
            </Stage>
        </div>
    );
}

