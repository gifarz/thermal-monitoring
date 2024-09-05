'use client'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function page() {
    const canvasRef = useRef(null);
    const router = useRouter(); // Initialize the router
    
    const buttons = [
        { label: 'OVERVIEW', x: 0.159, y: 0.937, width: 0.1, height: 0.052, href: '/overview' },
        { label: 'ARCHITECTURE', x: 0.261, y: 0.937, width: 0.1, height: 0.052, href: '/' },
        { label: 'ALARM', x: 0.363, y: 0.937, width: 0.1, height: 0.052, href: '/alarm' },
        { label: 'TREND', x: 0.465, y: 0.937, width: 0.1, height: 0.052, href: '/trend' },
        { label: 'LOG', x: 0.567, y: 0.937, width: 0.1, height: 0.052, href: '/log' },
        { label: 'SETTING', x: 0.669, y: 0.937, width: 0.1, height: 0.052, href: '/setting' },
    ];

    const sites = [
      { label: 'DONGGI', x: 0.02, y: 0.35, width: 0.35, height: 0.53, href: '/overview' },
      { label: 'MATINDOK', x: 0.62, y: 0.35, width: 0.35, height: 0.53, href: '/overview' },
  ];

    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const bgImage = new Image();

        bgImage.src = `/canvas/arsitektur.png`;

        const resizeCanvas = () => {
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;

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

            sites.forEach(site => {
              const siteX = xOffset + site.x * imgWidth;
              const siteY = yOffset + site.y * imgHeight;
              const siteWidth = site.width * imgWidth;
              const siteHeight = site.height * imgHeight;

              // Draw site background
              ctx.fillStyle = 'transparent';
              ctx.fillRect(siteX, siteY, siteWidth, siteHeight);

              // Draw site label
              // ctx.fillStyle = 'white';
              // ctx.font = `${siteHeight * 0.5}px Arial`;
              // ctx.textAlign = 'center';
              // ctx.textBaseline = 'middle';
              ctx.fillText(site.label, siteX + siteWidth / 2, siteY + siteHeight / 2);

              site.bounds = { x: siteX, y: siteY, width: siteWidth, height: siteHeight };
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
                    // Navigate to the respective page without a full page refresh
                    router.push(button.href);
                }
            });

            sites.forEach(site => {
              if (
                  x > site.bounds.x && x < site.bounds.x + site.bounds.width &&
                  y > site.bounds.y && y < site.bounds.y + site.bounds.height
              ) {
                  // Set the site to the localStorage
                  localStorage.setItem('site', site.label)
                  router.push(site.href);
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

            sites.forEach(site => {
              if (
                  x > site.bounds.x && x < site.bounds.x + site.bounds.width &&
                  y > site.bounds.y && y < site.bounds.y + site.bounds.height
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