'use client'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  menuButtonV2 as menuButton,
  panelButtonDonggiV2 as panelButtonDonggi,
  fixWidth,
  fixHeight,
  initXValue,
  initXValue2,
  fibbXValue,
  minYValue,
  maxYValue,
  avgYValue,
  minYValue2,
  maxYValue2,
  avgYValue2
} from '@/utils/coordinates';
import { selectRealtimeDonggi } from '@/pages/api/selectDonggiData';
import useSWR from 'swr';
import LoadingComp from '@/components/LoadingComp';

export default function page() {
  const [panelValue, setPanelValue] = React.useState()
  const { data, error, isLoading } = useSWR(
    '/api/selectDonggiData',
    selectRealtimeDonggi,
    { refreshInterval: 1000 }
  )

  const canvasRef = useRef(null);
  const router = useRouter(); // Initialize the router
  const [locStorage, setLocStorage] = React.useState('DONGGI');

  useEffect(() => {
    const canvas = canvasRef.current;

    if(canvas){
      const ctx = canvas.getContext('2d');
      let imgAspectRatio = 1; // Default aspect ratio
  
      const bgImage = new Image();
      bgImage.src = `/v2/donggi/overview.png`;
  
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
  
        // Draw Panel
        panelButtonDonggi.forEach(panel => {
          const panelX = panel.x * canvasWidth;
          const panelY = panel.y * canvasHeight;
          const panelWidth = panel.width * canvasWidth;
          const panelHeight = panel.height * canvasHeight;
  
          // Draw panel background
          // ctx.fillStyle = 'black';
          // ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
  
          // Draw panel label
          // ctx.fillStyle = 'black';
          // ctx.font = `${panelHeight * 0.1}px Arial`;
          // ctx.textAlign = 'center';
          // ctx.textBaseline = 'middle';
          // ctx.fillText(panel.label, panelX + panelWidth / 2, panelY + panelHeight / 2);
  
          panel.bounds = { x: panelX, y: panelY, width: panelWidth, height: panelHeight };
        });
  
        // Draw Min Max Avg
        panelValue?.forEach(value => {
          const valueWidth = value.width * canvasWidth;
          const valueHeight = value.height * canvasHeight;
  
          value.data.forEach(item => {
            const valueX = value.x * canvasWidth;
            const valueY = item.y * canvasHeight;
  
            // Draw value background
            ctx.fillStyle = 'transparent';
            ctx.fillRect(valueX, valueY, valueWidth, valueHeight);
  
            // Draw value label
            ctx.fillStyle = 'black';
            ctx.font = `${valueHeight * 0.5}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.tvalue, valueX + valueWidth / 2, valueY + valueHeight / 2);
  
            item.bounds = { x: valueX, y: valueY, width: valueWidth, height: valueHeight };
          })
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
            // Navigate to the respective page without a full page refresh
            router.push(button.href);
          }
        });
  
        panelButtonDonggi.forEach(panel => {
          if (
            x > panel.bounds.x && x < panel.bounds.x + panel.bounds.width &&
            y > panel.bounds.y && y < panel.bounds.y + panel.bounds.height
          ) {
            // Navigate to the respective page without a full page refresh
            router.push(panel.href);
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
  
        panelButtonDonggi.forEach(panel => {
          if (
            x > panel.bounds.x && x < panel.bounds.x + panel.bounds.width &&
            y > panel.bounds.y && y < panel.bounds.y + panel.bounds.height
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
  
      const intervalId = setInterval(() => {
        updatePanelValue(data)
        // console.log('panelValue', panelValue)
      }, 1000);
  
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        canvas.removeEventListener('click', handleClick);
        canvas.removeEventListener('mousemove', handleMouseMove);
        clearInterval(intervalId);
      };
    }
  }, [menuButton, panelValue, data]);

  const updatePanelValue = (data) => {

    let newData = []
    let isFirst = true
    let xValueTop = initXValue
    let xValueBottom = initXValue2

    if (data) {
      // Iterate over each data object
      data.forEach(dataItem => {
        const [label, tag] = dataItem?.tname?.split('_');  // Split tname into label and tag

        const containsMax = tag.includes('Max')
        const containsMin = tag.includes('Min')
        const containsAvg = tag.includes('Avg')

        if (containsMax || containsMin || containsAvg) {

          if (dataItem.id >= 244 && dataItem.id <= 267) {

            // Find if there's already an entry in newData with the same tag
            let group = newData.find(item => item.tag === label);

            if (!group) {

              if (isFirst) {
                xValueTop = xValueTop
                isFirst = false
              } else {
                xValueTop += fibbXValue
              }
              // If the group doesn't exist, create a new entry
              group = {
                tag: label,
                width: fixWidth,
                height: fixHeight,
                x: xValueTop,
                data: []
              };
              newData.push(group);
            }

            // Push the current object to the data array of the group
            group.data.push({
              id: dataItem.id,
              tname: tag,
              tvalue: dataItem.tvalue == '' ? 0 : dataItem.tvalue,
              y: tag == 'Min' ? minYValue : tag == 'Max' ? maxYValue : tag == 'Avg' ? avgYValue : 0
            });

          } else {
            // Find if there's already an entry in newData with the same tag
            let group = newData.find(item => item.tag === label);

            if (!group) {

              if (isFirst) {
                xValueBottom = xValueBottom
                isFirst = false
              } else {
                xValueBottom += fibbXValue
              }
              // If the group doesn't exist, create a new entry
              group = {
                tag: label,
                width: fixWidth,
                height: fixHeight,
                x: xValueBottom,
                data: []
              };
              newData.push(group);
            }

            // Push the current object to the data array of the group
            group.data.push({
              id: dataItem.id,
              tname: tag,
              tvalue: dataItem.tvalue == '' ? 0 : dataItem.tvalue,
              y: tag == 'Min' ? minYValue2 : tag == 'Max' ? maxYValue2 : tag == 'Avg' ? avgYValue2 : 0
            });
          }
        }
      });
    }

    setPanelValue(newData)
    // console.log('newData', newData)
  };

  // if (error) return <p>Error when loading page</p>
  // if (isLoading) return <LoadingComp flag={'page'} />
  // if (panelValue == undefined) return <LoadingComp flag={'panel'} />

  return (
    <div style={{ width: '100%', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
    </div>
  );
}

