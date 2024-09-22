'use client'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    menuButton, 
    panelButtonDonggi, 
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

export default function page() {
    const [ panelValue, setPanelValue ] = React.useState()
    const { data, error, isLoading } = useSWR(
        '/api/selectDonggiData', 
        selectRealtimeDonggi, 
        { refreshInterval: 1000 }
    )

    const canvasRef = useRef(null);
    const router = useRouter(); // Initialize the router

    useEffect(() => {

        const site = localStorage.getItem('site') ? localStorage.getItem('site') : 'DONGGI'
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bgImage = new Image();

        // console.log('site', site)

        if(site == 'DONGGI'){
            bgImage.src = `/v2/donggi/overview.png`;

        } else if(site == 'MATINDOK'){
            bgImage.src = `/v1/overview2.png`;
        }

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
                ctx.fillStyle = 'tranparent';
                // ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

                // Draw button label
                // ctx.fillStyle = 'white';
                // ctx.font = `${btnHeight * 0.5}px Arial`;
                // ctx.textAlign = 'center';
                // ctx.textBaseline = 'middle';
                // ctx.fillText(button.label, btnX + btnWidth / 2, btnY + btnHeight / 2);

                button.bounds = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
            });

            // Draw Panel
            panelButtonDonggi.forEach(panel => {
                const panelX = xOffset + panel.x * imgWidth;
                const panelY = yOffset + panel.y * imgHeight;
                const panelWidth = panel.width * imgWidth;
                const panelHeight = panel.height * imgHeight;

                // Draw panel background
                ctx.fillStyle = 'transparent';
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
                const valueWidth = value.width * imgWidth;
                const valueHeight = value.height * imgHeight;

                value.data.forEach(item => {
                    const valueX = xOffset + value.x * imgWidth;
                    const valueY = yOffset + item.y * imgHeight;
                    
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

        const intervalId = setInterval(() => {
            updatePanelValue(data)
            // console.log('panelValue', panelValue)
        }, 1000);

        bgImage.onload = resizeCanvas;
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('click', handleClick);
            canvas.addEventListener('mousemove', handleMouseMove);
            clearInterval(intervalId);
        };
    }, [menuButton, panelValue, data]);

    const updatePanelValue = (data) => {

        let newData = []
        let isFirst = true
        let xValueTop = initXValue
        let xValueBottom = initXValue2

        if(data){
            // Iterate over each data object
            data?.forEach(dataItem => {
                const [label, tag] = dataItem.tname.split('_');  // Split tname into label and tag

                const containsMax = tag.includes('Max')
                const containsMin = tag.includes('Min')
                const containsAvg = tag.includes('Avg')

                if (containsMax || containsMin || containsAvg) {

                    if(dataItem.id >= 244 && dataItem.id <= 267){

                        // Find if there's already an entry in newData with the same tag
                        let group = newData.find(item => item.tag === label);
        
                        if (!group) {

                            if(isFirst){
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

                            if(isFirst){
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

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }} />
        </div>
    );
};