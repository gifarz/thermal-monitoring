'use client'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { menuButton } from '@/utils/coordinates';
import { useTable } from 'react-table';

const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Age',
        accessor: 'age',
    },
    {
        Header: 'Country',
        accessor: 'country',
    },
];

const data = [
    { name: 'John', age: 25, country: 'USA' },
    { name: 'Jane', age: 28, country: 'Canada' },
    { name: 'Michael', age: 22, country: 'UK' },
];

export default function page() {
    const canvasRef = useRef(null);
    const router = useRouter(); // Initialize the router
    const tableInstance = useTable({ columns, data });

    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const bgImage = new Image();

        bgImage.src = `/v2/donggi/alarm.png`;

        const resizeCanvas = () => {
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            drawCanvas(canvasWidth, canvasHeight);
        };

        const drawCanvas = (canvasWidth, canvasHeight) => {
            // Get device pixel ratio (for handling high-DPI screens)
            const dpr = window.devicePixelRatio || 1;

            // Set canvas dimensions based on the device pixel ratio
            canvas.width = canvasWidth * dpr;
            canvas.height = canvasHeight * dpr;

            // Scale the context to handle high-DPI
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

            // Draw the image to fill the entire canvas
            // ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

            // Draw buttons
            menuButton.forEach(button => {
                const btnX = xOffset + button.x * imgWidth;
                const btnY = yOffset + button.y * imgHeight;
                const btnWidth = button.width * imgWidth;
                const btnHeight = button.height * imgHeight;

                // Draw button background
                ctx.fillStyle = 'transparent';
                ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

                // Draw button label
                // ctx.fillStyle = 'white';
                // ctx.font = `${btnHeight * 0.5}px Arial`;
                // ctx.textAlign = 'center';
                // ctx.textBaseline = 'middle';
                ctx.fillText(button.label, btnX + btnWidth / 2, btnY + btnHeight / 2);

                button.bounds = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
            });

            // handleTable();
        };

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

            if (hovering) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = 'default';
            }
        };

        const handleTable = () => {
            // Draw table headers and rows
            const startX = 50;
            const startY = 50;
            const cellWidth = 100;
            const cellHeight = 40;

            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeStyle = 'black';

            // Draw headers
            tableInstance.headerGroups.forEach(headerGroup => {
                headerGroup.headers.forEach((column, colIndex) => {
                    const x = startX + colIndex * cellWidth;
                    ctx.strokeRect(x, startY, cellWidth, cellHeight);
                    ctx.fillText(column.render('Header'), x + cellWidth / 2, startY + cellHeight / 2);
                });
            });

            // Draw rows
            tableInstance.rows.forEach((row, rowIndex) => {
                tableInstance.prepareRow(row);
                row.cells.forEach((cell, colIndex) => {
                    const x = startX + colIndex * cellWidth;
                    const y = startY + (rowIndex + 1) * cellHeight;
                    ctx.strokeRect(x, y, cellWidth, cellHeight);
                    ctx.fillText(cell.render('Cell'), x + cellWidth / 2, y + cellHeight / 2);
                });
            });
        }

        bgImage.onload = resizeCanvas;
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('click', handleClick);
            canvas.addEventListener('mousemove', handleMouseMove);
        };
    }, [menuButton]);

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }} />
        </div>
    );
};