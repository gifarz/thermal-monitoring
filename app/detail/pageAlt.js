'use client'

import React from 'react';
import Chart from 'chart.js/auto';

export default function Page() {

    const canvasRef = React.useRef(null);
    const chartInstanceRef = React.useRef(null);  // Store chart instance

    React.useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const bgImage = new Image();
        bgImage.src = `/v2/donggi/detail.png`;

        const resizeCanvas = () => {
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            drawCanvas(canvasWidth, canvasHeight);
        };

        const drawCanvas = (canvasWidth, canvasHeight) => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvasWidth * dpr;
            canvas.height = canvasHeight * dpr;
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const imgAspectRatio = bgImage.width / bgImage.height;
            const canvasAspectRatio = canvasWidth / canvasHeight;

            let imgWidth, imgHeight;
            if (canvasAspectRatio > imgAspectRatio) {
                imgHeight = canvasHeight;
                imgWidth = imgHeight * imgAspectRatio;
            } else {
                imgWidth = canvasWidth;
                imgHeight = imgWidth / imgAspectRatio;
            }

            const xOffset = (canvasWidth - imgWidth) / 2;
            const yOffset = (canvasHeight - imgHeight) / 2;

            // Draw the background image
            ctx.drawImage(bgImage, xOffset, yOffset, imgWidth, imgHeight);

            // Draw the line chart
            lineChart(xOffset, yOffset, imgWidth, imgHeight);
        }

        const lineChart = (xOffset, yOffset, imgWidth, imgHeight) => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            // Create a new offscreen canvas to use with Chart.js
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = imgWidth * 0.3;  // Example width
            offscreenCanvas.height = imgHeight * 0.5;  // Example height
            const offscreenCtx = offscreenCanvas.getContext('2d');

            // Set the scaling factors for chart elements to adjust with canvas size
            const fontScale = Math.min(imgWidth, imgHeight) / 600;  // Example scaling factor for fonts

            chartInstanceRef.current = new Chart(offscreenCtx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                    datasets: [{
                        label: 'Dataset',
                        data: [65, 59, 80, 81, 56, 55],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        tension: 0.1,
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
                            display: true,
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
            ctx.drawImage(offscreenCanvas, xOffset + 0.65 * imgWidth, yOffset + 0.25 * imgHeight, offscreenCanvas.width, offscreenCanvas.height);
        }

        bgImage.onload = resizeCanvas;
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };

    }, []);

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }} />
        </div>
    );
};
