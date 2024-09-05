'use client'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function page() {
    const canvasRef = useRef(null);
    const router = useRouter(); // Initialize the router

    const buttons = [
        { label: 'OVERVIEW', x: 0.222, y: 0.926, width: 0.1, height: 0.052, href: '/canvas/overview' },
        { label: 'ALARM', x: 0.325, y: 0.926, width: 0.1, height: 0.052, href: '/canvas/alarm' },
        { label: 'TREND', x: 0.430, y: 0.926, width: 0.1, height: 0.052, href: '/canvas/trend' },
        { label: 'LOG', x: 0.535, y: 0.926, width: 0.1, height: 0.052, href: '/canvas/log' },
        { label: 'SETTING', x: 0.640, y: 0.926, width: 0.1, height: 0.052, href: '/canvas/setting' },
    ];

    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const bgImage = new Image();

        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname; // Get current path

            console.log('currentPath', currentPath)
            console.log('currentPath', currentPath.split('/'))

            // currPath = currentPath.split('/')[2]
            bgImage.src = `/${currentPath.split('/')[2]}.png`;
        }

        const resizeCanvas = () => {
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;
            console.log('canvasWidth', canvasWidth)
            console.log('canvasHeight', canvasHeight)
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            drawCanvas(canvasWidth, canvasHeight);
        };

        const drawCanvas = (canvasWidth, canvasHeight) => {
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

            // Draw the table on the bgImage
            drawTable(ctx, xOffset, yOffset, imgWidth, imgHeight);

            // Draw the image to fill the entire canvas
            // ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

            // Draw buttons
            buttons.forEach(button => {
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
        };

        const drawTable = (ctx, xOffset, yOffset, imgWidth, imgHeight) => {
            const rows = 5;
            const cols = 4;
            const cellWidth = imgWidth * 0.16;
            const cellHeight = imgHeight * 0.06;

            const marginTop = imgHeight * 0.1;  // Adjust this value to set the margin top
            const marginLeft = imgWidth * 0.02;  // Adjust this value to set the margin top
            const startX = xOffset + imgWidth * 0.15 + marginLeft;
            const startY = yOffset + imgHeight * 0.25 + marginTop;

            const headers = ['Time', 'Temperature', 'Status', 'Notes'];

            // Adjust font size based on cell height
            ctx.font = `${cellHeight * 0.5}px Arial`;
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';

            headers.forEach((header, index) => {
                ctx.fillText(header, startX + index * cellWidth + 10, startY - cellHeight / 2);
            });

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;

            for (let i = 0; i <= rows; i++) {
                ctx.beginPath();
                ctx.moveTo(startX, startY + i * cellHeight);
                ctx.lineTo(startX + cols * cellWidth, startY + i * cellHeight);
                ctx.stroke();
            }

            for (let i = 0; i <= cols; i++) {
                ctx.beginPath();
                ctx.moveTo(startX + i * cellWidth, startY);
                ctx.lineTo(startX + i * cellWidth, startY + rows * cellHeight);
                ctx.stroke();
            }
        };

        const handleClick = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            buttons.forEach(button => {
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

            buttons.forEach(button => {
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

        bgImage.onload = resizeCanvas;
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('click', handleClick);
            canvas.addEventListener('mousemove', handleMouseMove);
        };
    }, [buttons]);

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }} />
        </div>
    );
};
