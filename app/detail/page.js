'use client'

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    menuButton,
    detailValuesV2 as detailValues,
    exportChartToImage
} from '@/utils/coordinates';
import useSWR from 'swr';
import { selectRealtimeDonggi } from '@/pages/api/donggi/selectRealtime';
import dynamic from 'next/dynamic';
import { selectRealtimeGeneral } from '@/pages/api/general/selectRealtime';
import { siteLocalStorage } from '@/utils/siteLocalStorage';

const ChartDetail = dynamic(() => import('@/components/ChartDetail'))
const LoginComp = dynamic(() => import('@/components/LoginComp'))

export default function page() {
    const [detailValue, setDetailValue] = React.useState(detailValues)
    const [chartValue, setChartValue] = React.useState([])
    const [canvasSize, setCanvasSize] = React.useState({ width: 0, height: 0 })
    const [imageGenerated, setImageGenerated] = React.useState(false);
    const [site, setSite] = React.useState()

    const { data, error, isLoading } = useSWR(
        site ? '/api/general/selectRealtime' : null,
        () => selectRealtimeGeneral(site),
        { refreshInterval: 1000 }
    )

    const borderColors = [
        "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige",
        "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown"
    ]
    const objectChartData = {
        label: '',
        data: [],  // Initially empty data
        borderColor: '',
        tension: 0.1,
    }

    const canvasRef = React.useRef(null);

    const router = useRouter(); // Initialize the router
    const searchParams = useSearchParams()

    const ref = searchParams.get('ref')
    const refPrefix = ref.split('-')[1] // ex donggi-L102, the value is L102

    React.useEffect(() => {

        // Validation site localStorage
        setSite(siteLocalStorage)

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let imgAspectRatio = 1; // Default aspect ratio

        const bgImage = new Image();

        bgImage.src = `/donggi/detail.webp`;

        const resizeCanvas = () => {
            // Ensure the image is loaded before calculating dimensions
            if (!bgImage.complete) return;
            setImageGenerated(true)

            const canvasWidth = window.innerWidth;
            imgAspectRatio = bgImage.width / bgImage.height;
            const canvasHeight = canvasWidth / imgAspectRatio;

            // Set canvas style dimensions (for display in the DOM)
            canvas.style.width = `${canvasWidth}px`;
            canvas.style.height = `${canvasHeight}px`;

            // Handle high-DPI screens
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvasWidth * dpr;
            canvas.height = canvasHeight * dpr;
            ctx.scale(dpr, dpr);

            drawCanvas(canvasWidth, canvasHeight);
            setCanvasSize({ width: canvasWidth, height: canvasHeight }); // Update canvas size
        };

        const drawCanvas = (canvasWidth, canvasHeight) => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            // Draw the background image to fill the canvas
            ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);

            // Draw the line chart 
            // lineChart(canvasWidth, canvasHeight);

            // Draw buttons
            menuButton.forEach(button => {
                const btnX = button.x * canvasWidth;
                const btnY = button.y * canvasHeight;
                const btnWidth = button.width * canvasWidth;
                const btnHeight = button.height * canvasHeight;

                // Draw button background
                ctx.fillStyle = 'transparent';
                ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

                // Draw button label
                ctx.fillStyle = 'white';
                ctx.font = `${btnHeight * 0.2}px Arial`;
                // ctx.textAlign = 'center';
                // ctx.textBaseline = 'middle';
                // ctx.fillText(button.label, btnX, btnY);

                button.bounds = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
            });

            // Draw detail value on the canvas
            detailValue.forEach(label => {
                const labelX = label.x * canvasWidth;
                const labelY = label.y * canvasHeight;
                const labelWidth = label.width * canvasWidth;
                const labelHeight = label.height * canvasHeight;

                // Draw button background
                ctx.fillStyle = 'transparent';
                ctx.fillRect(labelX, labelY, labelWidth, labelHeight);

                // Set font and style for text
                ctx.fillStyle = 'black'; // Text color
                ctx.font = `${labelHeight * 0.2}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                ctx.fillText(label.value, labelX, labelY);

                label.bounds = { x: labelX, y: labelY, width: labelWidth, height: labelHeight };
            });

            // Draw button export chart on the canvas
            // exportChartToImage.forEach(button => {
            //     const buttonX = button.x * canvasWidth;
            //     const buttonY = button.y * canvasHeight;
            //     const buttonWidth = button.width * canvasWidth;
            //     const buttonHeight = button.height * canvasHeight;

            //     // Draw button background
            //     ctx.fillStyle = '#303236';
            //     ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 5);
            //     ctx.fill();

            //     // Set font and style for text
            //     ctx.fillStyle = 'white'; // Text color
            //     ctx.font = `${buttonHeight * 0.35}px Arial`;
            //     ctx.textAlign = 'center';
            //     ctx.textBaseline = 'middle';

            //     ctx.fillText(button.label, buttonX * 1.04, buttonY * 1.09);

            //     button.bounds = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
            // });

        }

        const handleClick = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            menuButton.forEach(button => {
                if (
                    x > button.bounds.x && x < button.bounds.x + button.bounds.width &&
                    y > button.bounds.y && y < button.bounds.y + button.bounds.height
                ) {
                    // Navigate to the respective page without a full page refresh
                    router.push(button.href);
                }
            });

        };

        const handleMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            let hovering = false;

            menuButton.forEach(button => {
                if (
                    x > button.bounds.x && x < button.bounds.x + button.bounds.width &&
                    y > button.bounds.y && y < button.bounds.y + button.bounds.height
                ) {
                    hovering = true;
                }
            });

            // exportChartToImage.forEach(button => {
            //     if (
            //         x > button.bounds.x && x < button.bounds.x + button.bounds.width &&
            //         y > button.bounds.y && y < button.bounds.y + button.bounds.height
            //     ) {
            //         hovering = true;
            //     }
            // });

            if (hovering) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = 'default';
            }
        };

        bgImage.onload = resizeCanvas;
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('click', handleClick);
            canvas.addEventListener('mousemove', handleMouseMove);
        };

    }, [menuButton, detailValue]);

    React.useEffect(() => {

        const updateDetailValue = () => {
            if (data) {
                // Filter the data based on refPrefix (e.g., "L103")
                const filteredData = data.filter(item => item.tname.includes(refPrefix));

                // console.log('filteredData', filteredData)
                // Update the labels array where tag matches the last part of tname (e.g., "T01")
                const updatedValue = detailValues.map(data => {
                    const matchingData = filteredData.find(item => item.tname.endsWith(data.tag));
                    return matchingData != undefined ? { ...data, value: matchingData.tvalue } : data;
                });

                setDetailValue(updatedValue);

                // SET THE VALUE FOR REALTIME CHART 

                const newChartData = updatedValue.map(item => ({
                    ...objectChartData,  // Spread the default object structure
                    label: item.tag,        // Update the label from the API data
                    data: [item.value],  // Set the data array from the API value
                }));

                // Append to the existing chartData without removing previous data
                setChartValue(prevChartValue => {

                    // If prevChartValue is empty, return the newChartData directly
                    if (!prevChartValue || prevChartValue.length === 0) {
                        return newChartData;
                    }

                    // If prevChartValue has data, merge new data
                    return prevChartValue.map((prevItem, index) => {

                        // Choose the borderColor
                        const pickedColor = borderColors[index]

                        // Find if there's a matching label in newChartData
                        const newItem = newChartData.find(newData => newData.label === prevItem.label);

                        if (newItem) {
                            // Append new data, then limit to the last 4 entries
                            const updatedData = [...prevItem.data, ...newItem.data].slice(-4);  // Keep only the last 4 items
                            // Append new data to the existing item's data array
                            return {
                                ...prevItem,
                                data: updatedData,
                                borderColor: pickedColor
                            };
                        }

                        // Remove the picked color from the list
                        borderColors.splice(index, 1);

                        // If no matching label is found, return the previous item unchanged
                        return prevItem;
                    })
                    
                });

            }
        };

        const intervalId = setInterval(() => {
            updateDetailValue()
            // console.log('chartValue', chartValue)
        }, 5000);

        return () => {
            clearInterval(intervalId);
        };

    }, [data, refPrefix])

    const minWidth = canvasSize.width * 0.31;
    const minHeight = canvasSize.height * 0.6;
    const marginTop = canvasSize.height * 0.32;
    const marginRight = canvasSize.height * 0.06;

    return (
        <>
            <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
                <div
                    className='absolute z-10'
                    style={{
                        right: marginRight,
                        top: marginTop
                    }}
                >
                    {
                        imageGenerated ?
                            <ChartDetail chartValue={chartValue} chartWidth={minWidth} chartHeight={minHeight} />
                            :
                            undefined
                    }
                </div>
                <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
            </div>

            <LoginComp/>
        </>
    );
};
