'use client'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
// import { menuButton } from '@/utils/coordinates';

export default function page() {
    const canvasRef = useRef(null);
    const router = useRouter(); // Initialize the router
    const [locStorage, setLocStorage] = React.useState("DONGGI")

    const menuButton = [
        { label: 'OVERVIEW', x: 0.158, y: 0.937, width: 0.1, height: 0.053, href: '/overview' },
        { label: 'ARCHITECTURE', x: 0.26, y: 0.937, width: 0.1, height: 0.053, href: `/arch/`+locStorage.toLowerCase() },
        { label: 'ALARM', x: 0.361, y: 0.937, width: 0.1, height: 0.053, href: '/alarm' },
        { label: 'TREND', x: 0.462, y: 0.937, width: 0.1, height: 0.053, href: '/trend' },
        { label: 'LOG', x: 0.563, y: 0.937, width: 0.1, height: 0.053, href: '/log' },
        { label: 'SETTING', x: 0.664, y: 0.937, width: 0.1, height: 0.053, href: '/setting' },
    ];

    const sites = [
        { label: 'DONGGI', x: 0.023, y: 0.35, width: 0.35, height: 0.53, href: '/overview' },
        { label: 'MATINDOK', x: 0.62, y: 0.35, width: 0.35, height: 0.53, href: '/overview' },
    ];

    useEffect(() => {

        setLocStorage(localStorage.getItem('site') ? localStorage.getItem('site') : 'DONGGI')
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const bgImage = new Image();

        bgImage.src = `/v1/arsitektur.png`;

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
                // ctx.fillStyle = 'black';
                // ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

                // Draw button label
                // ctx.fillStyle = 'white';
                // ctx.font = `${btnHeight * 0.5}px Arial`;
                // ctx.textAlign = 'center';
                // ctx.textBaseline = 'middle';
                // ctx.fillText(button.label, btnX + btnWidth / 2, btnY + btnHeight / 2);

                button.bounds = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
            });

            // Draw sites
            sites.forEach(site => {
                const btnX = xOffset + site.x * imgWidth;
                const btnY = yOffset + site.y * imgHeight;
                const btnWidth = site.width * imgWidth;
                const btnHeight = site.height * imgHeight;

                // Draw site background
                // ctx.fillStyle = 'black';
                // ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

                // Draw site label
                // ctx.fillStyle = 'white';
                // ctx.font = `${btnHeight * 0.5}px Arial`;
                // ctx.textAlign = 'center';
                // ctx.textBaseline = 'middle';
                // ctx.fillText(site.label, btnX + btnWidth / 2, btnY + btnHeight / 2);

                site.bounds = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
            });
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

            sites.forEach(button => {
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

            sites.forEach(button => {
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
    }, [menuButton]);

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }} />
        </div>
    );
};