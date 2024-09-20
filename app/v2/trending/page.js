'use client'

// import MainPageV2Comp from '@/components/MainPageV2Comp';
import React from 'react';
import { usePathname } from 'next/navigation'
import { selectAlgDonggi } from '@/pages/api/selectDonggiData';
import useSWR from 'swr';
import {
    Progress
} from "@nextui-org/react";
import dynamic from 'next/dynamic'
import LoadingComp from '@/components/LoadingComp';
import useImage from 'use-image';
import { useRouter } from 'next/navigation';
import { Stage, Layer, Image, Rect, Text } from 'react-konva';
import { menuButtonV2 as menuButton } from '@/utils/coordinates';

function page(props) {
    const [ imageUrl, setImageUrl ] = React.useState()
    const [ image ] = useImage(`${imageUrl}.png`);
    const router = useRouter();
    const [canvasSize, setCanvasSize] = React.useState();
    const [imgAspectRatio, setImgAspectRatio] = React.useState(1); // Default aspect ratio
    const [startDate, setStartDate] = React.useState('Start Date');
    const [endDate, setEndDate] = React.useState('End Date');
    const { data, error, isLoading } = useSWR(
        '/api/selectDonggiData',
        selectAlgDonggi,
        { refreshInterval: 1000 }
    )
    const pathname = usePathname()

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const site = localStorage.getItem('site').toLowerCase()
            const pageName = pathname.split('/')[2]

            const url = `/v2/${site}/${pageName}`

            setImageUrl(url)
        }

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

    }, [image, data]);

    if (canvasSize == undefined) return <LoadingComp flag={'canvas'}/>
    if (error) return <p>Error when loading page</p>
    if (isLoading) return <LoadingComp flag={'page'}/>

    const headerTable = ['ID', 'TIMESTAMP', 'ALARMID', 'STATUS']
    const bodyTable = data

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
        a.setAttribute('download', 'Data Alarm.csv');
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
    const tableY = ((canvasSize.height - (bodyTable.length + 1) * cellHeight) / 2) + 50; // +1 for the header 

    if (error) return <p>Error when loading page</p>
    if (isLoading) return <LoadingComp />

    console.log('data trending', data)

    return (
        <>
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
                                onClick={handleStartDateClick} // Simulate date selection on click
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
                                onClick={handleEndDateClick} // Simulate date selection on click
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
                            bodyTable?.map((rowData, rowIndex) =>
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

                    </Layer>
                </Stage>
            </div>
            {/* <MainPageV2Comp path={imageUrl} trending={data}/> */}
        </>
    );
}

export default page;