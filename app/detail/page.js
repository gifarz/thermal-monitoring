'use client'

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    menuButtonV2 as menuButton, 
    detailValuesV2 as detailValues, 
    exportChartToImage 
} from '@/utils/coordinates';
// import selectDonggiData from '@/pages/api/selectDonggiData';
import { selectRealtimeDonggi } from '@/pages/api/selectDonggiData';
import useSWR from 'swr';
import Chart from 'chart.js/auto';

export default function page() {
    const [detailValue, setDetailValue] = React.useState(detailValues)
    const { data, error, isLoading } = useSWR(
        '/api/selectDonggiData',
        selectRealtimeDonggi,
        { refreshInterval: 1000 }
    )

    const canvasRef = React.useRef(null);
    const chartInstanceRef = React.useRef(null);  // Store chart instance
    const router = useRouter(); // Initialize the router
    const searchParams = useSearchParams()

    const ref = searchParams.get('ref')
    const refPrefix = ref.split('-')[1] // ex donggi-L102, the value is L102

    React.useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let imgAspectRatio = 1; // Default aspect ratio

        const bgImage = new Image();

        bgImage.src = `/donggi/detail.png`;

        const resizeCanvas = () => {
            // Ensure the image is loaded before calculating dimensions
            if (!bgImage.complete) return;

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
        };

        const drawCanvas = (canvasWidth, canvasHeight) => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            // Draw the background image to fill the canvas
            ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);

            // Draw the line chart 
            lineChart(canvasWidth, canvasHeight);

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
            exportChartToImage.forEach(button => {
                const buttonX = button.x * canvasWidth;
                const buttonY = button.y * canvasHeight;
                const buttonWidth = button.width * canvasWidth;
                const buttonHeight = button.height * canvasHeight;

                // Draw button background
                ctx.fillStyle = '#303236';
                ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 5);
                ctx.fill();

                // Set font and style for text
                ctx.fillStyle = 'white'; // Text color
                ctx.font = `${buttonHeight * 0.35}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                ctx.fillText(button.label, buttonX * 1.04, buttonY * 1.09);

                button.bounds = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
            });

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

            exportChartToImage.forEach(button => {
                if (
                    x > button.bounds.x && x < button.bounds.x + button.bounds.width &&
                    y > button.bounds.y && y < button.bounds.y + button.bounds.height
                ) {
                    // Navigate to the respective page without a full page refresh
                    handleExport()
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

            exportChartToImage.forEach(button => {
                if (
                    x > button.bounds.x && x < button.bounds.x + button.bounds.width &&
                    y > button.bounds.y && y < button.bounds.y + button.bounds.height
                ) {
                    hovering = true;
                }
            });

            if (hovering) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = 'default';
            }
        };

        const lineChart = (imgWidth, imgHeight) => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            // Create a new offscreen canvas to use with Chart.js
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = imgWidth * 0.2;  // Example width
            offscreenCanvas.height = imgHeight * 0.4;  // Example height
            const offscreenCtx = offscreenCanvas.getContext('2d');

            // Set the scaling factors for chart elements to adjust with canvas size
            const fontScale = Math.min(imgWidth, imgHeight) / 800;  // Example scaling factor for fonts

            chartInstanceRef.current = new Chart(offscreenCtx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                    datasets: [{
                        label: 'Dataset',
                        data: [65, 59, 80, 81, 56, 55],
                        borderColor: 'rgb(105, 106, 107)',
                        tension: 0.05,
                    }],
                },
                options: {
                    responsive: false,
                    animation: false,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                font: {
                                    size: 12 * fontScale  // Scale font size
                                }
                            }
                        },
                        title: {
                            display: false,
                            text: 'Line Chart Example',
                            font: {
                                size: 16 * fontScale  // Scale title size
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                font: {
                                    size: 10 * fontScale  // Scale x-axis label font size
                                }
                            }
                        },
                        y: {
                            ticks: {
                                font: {
                                    size: 10 * fontScale  // Scale y-axis label font size
                                }
                            }
                        }
                    }
                }
            });

            // Draw the chart from the offscreen canvas onto the main canvas
            ctx.drawImage(offscreenCanvas, 0.65 * imgWidth, 0.28 * imgHeight, offscreenCanvas.width, offscreenCanvas.height);
        }

        bgImage.onload = resizeCanvas;
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('click', handleClick);
            canvas.addEventListener('mousemove', handleMouseMove);

            // Destroy the chart instance when the component is unmounted
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
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
            }
        };

        const intervalId = setInterval(() => {
            updateDetailValue()
            // console.log('detailValue', detailValue)
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };

    }, [data, refPrefix])

    const handleExport = () => {
        const chart = chartInstanceRef.current;

        // Convert chart to Base64 Image
        const image = chart.toBase64Image();

        // Create a link element to download the image
        const link = document.createElement('a');
        link.href = image;
        link.download = `Chart_${ref}.png`; // Name the file as 'chart.png'
        link.click(); // Programmatically click the link to trigger download
    };

    return (
        <div style={{ width: '100%', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
        </div>
    );
};