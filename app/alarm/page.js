'use client'

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { menuButton } from '@/utils/coordinates';
import { selectAlgDonggi } from '@/pages/api/selectDonggiData';
import useSWR from 'swr';
import dynamic from 'next/dynamic';

const TableAlarmComp = dynamic(() => import('@/components/TableAlarmComp'))

export default function page() {
  const canvasRef = useRef(null);
  const router = useRouter(); // Initialize the router
  const [imageGenerated, setImageGenerated] = useState(false);
  const [childData, setChildData] = useState('All');
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const { data, error, isLoading } = useSWR(
    childData ? `/api/selectDonggiData` : null,
    () => selectAlgDonggi(childData),
    { refreshInterval: 1000 }
  );

  // Callback function that will be passed to the child
  const handleChildData = (data) => {
    // console.log('Child Data in function', data)
    setChildData(data); // Updating parent state with data from child
  };

  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let imgAspectRatio = 1; // Default aspect ratio

    const bgImage = new Image();
    bgImage.src = `/donggi/alarm.webp`;

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
      setCanvasSize({ width: canvasWidth, height: canvasHeight }); // Update canvas size

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

      setImageGenerated(true)
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
          // setStartSwr(false)
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

  const tableMaxHeight = canvasSize.height * 0.6
  const tableMaxWidth = canvasSize.width * 0.95
  const tableMinWidth = canvasSize.width * 0.9
  const tableMarginTop = canvasSize.height * 0.17

  console.log('tableMaxHeight',tableMaxHeight)
  console.log('tableMaxWidth',tableMaxWidth)
  console.log('tableMinWidth',tableMinWidth)
  console.log('tableMarginTop',tableMarginTop)

  return (
    <div style={{ width: '100%', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <div
        className='absolute w-1/2 z-10 left-1/2 mt-10'
        style={{
          overflow: 'auto',
          transform: 'translate(-50%, 0)',
          maxHeight: tableMaxHeight,
          maxWidth: tableMaxWidth,
          minWidth: tableMinWidth,
          top: tableMarginTop
        }}
      >
        {
          imageGenerated ?
            <TableAlarmComp
              sendStatus={handleChildData}
              data={data}
              isLoading={isLoading}
            />
            :
            undefined
        }
      </div>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
    </div>
  );
}
