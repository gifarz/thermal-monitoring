'use client'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  menuButton,
  indicatorLampFlag,
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
  avgYValue2,
  startAngleIndicator,
  endAngleIndicator,
  setATHHH,
  setATHH
} from '@/utils/coordinates';
import useSWR from 'swr';
import { siteLocalStorage } from '@/utils/siteLocalStorage';
import { boundClickDonggi, boundHoverDonggi, menuButtonDonggi, panelButtonDonggi } from '@/utils/boundDonggi';
import { boundClickMatindok, boundHoverMatindok, menuButtonMatindok, panelButtonMatindok } from '@/utils/boundMatindok';
import { indicatorLampCoordinate as indicatorLampCoordinateDonggi } from '@/utils/coordinateDonggi';
import {
  indicatorLampCoordinate as indicatorLampCoordinateMatindok,
  fixWidth as fixWidthMat,
  fixHeight as fixHeightMat,
  initXValue as initXValueMat,
  initXValue2 as initXValue2Mat,
  fibbXValue as fibbXValueMat,
  minYValue as minYValueMat,
  maxYValue as maxYValueMat,
  avgYValue as avgYValueMat,
  minYValue2 as minYValue2Mat,
  maxYValue2 as maxYValue2Mat,
  avgYValue2 as avgYValue2Mat,
  // startAngleIndicator,
  // endAngleIndicator,
  // setATHHH,
  // setATHH
} from '@/utils/coordinateMatindok';
import { selectRealtimeGeneral } from '@/pages/api/general/selectRealtime';
import dynamic from 'next/dynamic';

const LoginComp = dynamic(() => import('@/components/LoginComp'))

export default function page() {
  const [panelValue, setPanelValue] = React.useState()
  const [indicatorValue, setIndicatorValue] = React.useState()
  const [site, setSite] = React.useState()

  const { data: dataRealtimeGeneral, error: errorRealtimeGeneral, isLoading: isLoadingRealtimeGeneral } = useSWR(
    site ? '/api/general/selectRealtime' : null,
    () => selectRealtimeGeneral(site)
  )

  const canvasRef = useRef(null);
  const router = useRouter(); // Initialize the router

  useEffect(() => {

    // Validation site localStorage
    setSite(siteLocalStorage)

    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      let imgAspectRatio = 1; // Default aspect ratio

      const bgImage = new Image();

      bgImage.src = site === 'donggi' ? `/donggi/overview.webp` : `/matindok/overview.webp`

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

        // Draw Indicator Lamp Flag
        indicatorLampFlag.forEach(indicator => {
          const indicatorX = indicator.x * canvasWidth;
          const indicatorY = indicator.y * canvasHeight;

          // Draw indicator background
          ctx.beginPath();
          ctx.arc(indicatorX, indicatorY, 7, startAngleIndicator, endAngleIndicator);  // Create the circle
          ctx.fillStyle = indicator.color
          ctx.fill();  // Fill the circle with the specified color
          ctx.strokeStyle = '';
        });

        if (site === 'donggi') {
          /** ------------------ START DONGGI SCOPE ------------------ */
          // Draw buttons
          menuButtonDonggi(ctx, canvasWidth, canvasHeight)

          // Draw Panel
          panelButtonDonggi(ctx, canvasWidth, canvasHeight)

          // Draw Indicator Lamp
          indicatorValue?.forEach(indicator => {
            const indicatorX = indicator.x * canvasWidth;
            const indicatorY = indicator.y * canvasHeight;

            // Draw indicator background
            ctx.beginPath();
            ctx.arc(indicatorX, indicatorY, 10, startAngleIndicator, endAngleIndicator);  // Create the circle
            ctx.fillStyle =
              indicator.value > setATHHH ? 'red' : //DANGER
                indicator.value > setATHH && indicator.value < setATHHH ? 'yellow' : //WARNING
                  indicator.value > 0 && indicator.value < setATHH ? 'green' : //NORMAL
                    'white'; //DISCONNECTED

            ctx.fill();  // Fill the circle with the specified color
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
          /** ------------------ END DONGGI SCOPE ------------------ */

        } else if (site === 'matindok') {
          /** ------------------ START DONGGI SCOPE ------------------ */
          menuButtonMatindok(ctx, canvasWidth, canvasHeight)
          panelButtonMatindok(ctx, canvasWidth, canvasHeight)

          // Draw Indicator Lamp
          indicatorValue?.forEach(indicator => {
            const indicatorX = indicator.x * canvasWidth;
            const indicatorY = indicator.y * canvasHeight;

            // Draw indicator background
            ctx.beginPath();
            ctx.arc(indicatorX, indicatorY, 10, startAngleIndicator, endAngleIndicator);  // Create the circle
            ctx.fillStyle =
              indicator.value > setATHHH ? 'red' : //DANGER
                indicator.value > setATHH && indicator.value < setATHHH ? 'yellow' : //WARNING
                  indicator.value > 0 && indicator.value < setATHH ? 'green' : //NORMAL
                    'white'; //DISCONNECTED

            ctx.fill();  // Fill the circle with the specified color
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
          /** ------------------ END DONGGI SCOPE ------------------ */
        }

      };

      const handleClick = event => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (site === 'donggi') {
          boundClickDonggi(x, y, router)
        } else if (site === 'matindok') {
          boundClickMatindok(x, y, router)
        }
      };

      const handleMouseMove = event => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (site === 'donggi') {
          boundHoverDonggi(x, y, canvas)
        } else if (site === 'matindok') {
          boundHoverMatindok(x, y, canvas)
        }
      };

      bgImage.onload = resizeCanvas;
      window.addEventListener('resize', resizeCanvas);
      canvas.addEventListener('click', handleClick);
      canvas.addEventListener('mousemove', handleMouseMove);

      const intervalId = setInterval(() => {
        updatePanelValue(dataRealtimeGeneral)
        // console.log('panelValue', panelValue)
      }, 1000);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        canvas.removeEventListener('click', handleClick);
        canvas.removeEventListener('mousemove', handleMouseMove);
        clearInterval(intervalId);
      };
    }
  }, [menuButton, panelValue, dataRealtimeGeneral]);

  const updatePanelValue = (data) => {

    let newData = []
    let isFirst = true
    let xValueTop = site ? (site == 'donggi' ? initXValue : initXValueMat) : null
    let xValueBottom = site ? (site == 'donggi' ? initXValue2 : initXValue2Mat) : null

    if (data) {
      // Iterate over each data object
      data.forEach(dataItem => {
        const [label, tag] = dataItem?.tname?.split('_');  // Split tname into label and tag

        const containsMax = tag?.includes('Max')
        const containsMin = tag?.includes('Min')
        const containsAvg = tag?.includes('Avg')

        if (containsMax || containsMin || containsAvg) {

          let topPanel = site == 'donggi' ? dataItem.id >= 244 && dataItem.id <= 267 : dataItem.id >= 256 && dataItem.id <= 299

          if (topPanel) {

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

            let minYValueFix = site == 'donggi' ? minYValue : minYValueMat
            let maxYValueFix = site == 'donggi' ? maxYValue : maxYValueMat
            let avgYValueFix = site == 'donggi' ? avgYValue : avgYValueMat

            // Push the current object to the data array of the group
            group.data.push({
              id: dataItem.id,
              tname: tag,
              tvalue: dataItem.tvalue == '' ? 0 : dataItem.tvalue,
              y: tag == 'Min' ? minYValueFix : tag == 'Max' ? maxYValueFix : tag == 'Avg' ? avgYValueFix : 0
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

            let minYValue2Fix = site == 'donggi' ? minYValue2 : minYValue2Mat
            let maxYValue2Fix = site == 'donggi' ? maxYValue2 : maxYValue2Mat
            let avgYValue2Fix = site == 'donggi' ? avgYValue2 : avgYValue2Mat

            // Push the current object to the data array of the group
            group.data.push({
              id: dataItem.id,
              tname: tag,
              tvalue: dataItem.tvalue == '' ? 0 : dataItem.tvalue,
              y: tag == 'Min' ? minYValue2Fix : tag == 'Max' ? maxYValue2Fix : tag == 'Avg' ? avgYValue2Fix : 0
            });
          }
        }
      });
    }

    setPanelValue(newData)

    let newIndicatorLamp = site == 'donggi' ? [...indicatorLampCoordinateDonggi] : [...indicatorLampCoordinateMatindok]

    panelValue?.forEach(panel => {
      newIndicatorLamp = newIndicatorLamp.map(indicator => {
        if (panel.tag == indicator.group) {

          return {
            ...indicator,
            value: panel.data[1].tvalue // Take the value of Max value from panelValue
          }
        }
        return indicator
      })
    })

    setIndicatorValue(newIndicatorLamp)
  };

  // if (error) return <p>Error when loading page</p>
  // if (isLoading) return <LoadingComp flag={'page'} />
  // if (panelValue == undefined) return <LoadingComp flag={'panel'} />

  // console.log('data matindok', dataRealtimeMatindok)

  return (
    <>
      <div style={{ width: '100%', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
      </div>

      <LoginComp/>
    </>
  );
}

