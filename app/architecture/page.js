'use client'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { menuButton } from '@/utils/coordinates';

export default function page() {
  const canvasRef = useRef(null);
  const router = useRouter(); // Initialize the router
  const [locStorage, setLocStorage] = React.useState('DONGGI');

  useEffect(() => {

    setLocStorage(localStorage.getItem('site') ? localStorage.getItem('site') : 'DONGGI');
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let imgAspectRatio = 1; // Default aspect ratio

    const bgImage = new Image();
    bgImage.src = `/donggi/v2/architecture.webp`;

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

      // Draw buttons
      menuButton.forEach(button => {
        const btnX = button.x * canvasWidth;
        const btnY = button.y * canvasHeight;
        const btnWidth = button.width * canvasWidth;
        const btnHeight = button.height * canvasHeight;

        // Draw button background
        ctx.fillStyle = 'transparent';
        ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

        // Draw button background
        // ctx.fillStyle = 'black';
        // ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

        // Optionally draw button visuals here

        button.bounds = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
      });

    };

    const handleClick = event => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      menuButton.forEach(button => {
        if (
          x > button.bounds.x && x < button.bounds.x + button.bounds.width &&
          y > button.bounds.y && y < button.bounds.y + button.bounds.height
        ) {
          router.push(button.href);
        }
      });
    };

    const handleMouseMove = event => {
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

    bgImage.onload = resizeCanvas;
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [menuButton]);

  return (
    <div style={{ width: '100%', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
    </div>
  );
}
