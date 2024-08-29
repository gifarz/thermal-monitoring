'use client'

import React, { useEffect, useRef } from 'react';

const ThermalMonitoring = () => {
    const canvasRef = useRef(null);

    // Button definitions (relative positions based on the background image size)
    const buttons = [
        { label: 'OVERVIEW', x: 0.22, y: 0.928, width: 0.1, height: 0.05, href: '#overview' },
        { label: 'ALARM', x: 0.32, y: 0.928, width: 0.1, height: 0.05, href: '#alarm' },
        { label: 'TREND', x: 0.42, y: 0.928, width: 0.1, height: 0.05, href: '#trend' },
        { label: 'LOG', x: 0.52, y: 0.928, width: 0.1, height: 0.05, href: '#log' },
        { label: 'SETTING', x: 0.62, y: 0.928, width: 0.1, height: 0.05, href: '#setting' },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bgImage = new Image();
        bgImage.src = '/overview.png'; // Use the correct path to your image

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawCanvas();
        };

        const drawCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const imgAspectRatio = bgImage.width / bgImage.height;
            const canvasAspectRatio = canvas.width / canvas.height;

            let imgWidth, imgHeight;
            if (canvasAspectRatio > imgAspectRatio) {
                imgHeight = canvas.height;
                imgWidth = imgHeight * imgAspectRatio;
            } else {
                imgWidth = canvas.width;
                imgHeight = imgWidth / imgAspectRatio;
            }

            const xOffset = (canvas.width - imgWidth) / 2;
            const yOffset = (canvas.height - imgHeight) / 2;

            ctx.drawImage(bgImage, xOffset, yOffset, imgWidth, imgHeight);

            // Draw the buttons
            buttons.forEach(button => {
                const btnX = xOffset + button.x * imgWidth;
                const btnY = yOffset + button.y * imgHeight;
                const btnWidth = button.width * imgWidth;
                const btnHeight = button.height * imgHeight;

                ctx.fillStyle = 'rgba(51, 51, 51, 0.8)';
                ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

                ctx.fillStyle = 'white';
                ctx.font = `${btnHeight * 0.5}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(button.label, btnX + btnWidth / 2, btnY + btnHeight / 2);

                button.bounds = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
            });
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
                    window.location.href = button.href;
                }
            });
        };

        bgImage.onload = resizeCanvas;
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('click', handleClick);
        };
    }, [buttons]);

    return (
        <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%' }} />
    );
};

export default ThermalMonitoring;
