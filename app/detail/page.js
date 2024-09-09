'use client'

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { menuButton, detailValues } from '@/utils/coordinates';
import selectDonggiData from '@/pages/api/selectDonggiData';
import useSWR from 'swr';

export default function page() {
    const [ detailValue, setDetailValue ] = React.useState(detailValues)
    const { data, error, isLoading } = useSWR(
        '/api/selectDonggiData', 
        selectDonggiData, 
        { refreshInterval: 1000 }
    )

    const canvasRef = React.useRef(null);
    const router = useRouter(); // Initialize the router
    const searchParams = useSearchParams()

    const ref = searchParams.get('ref')
    const refPrefix = ref.split('-')[1] // ex donggi-L102, the value is L102

    React.useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const bgImage = new Image();

        bgImage.src = `/v2/donggi/detail.png`;

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

            // Draw each label on the canvas
            detailValue.forEach(label => {
                const labelX = xOffset + label.x * imgWidth;
                const labelY = yOffset + label.y * imgHeight;
                const labelWidth = label.width * imgWidth;
                const labelHeight = label.height * imgHeight;

                // Set font and style for text
                ctx.fillStyle = 'black'; // Text color
                ctx.font = `${labelHeight * 0.2}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                ctx.fillText(label.value, labelX + labelWidth / 2, labelY + labelHeight / 2);

                label.bounds = { x: labelX, y: labelY, width: labelWidth, height: labelHeight };
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

        bgImage.onload = resizeCanvas;
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('mousemove', handleMouseMove);

        const intervalId = setInterval(() => {
            updateDetailValue()
            // console.log('detailValue', detailValue)
        }, 1000);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('click', handleClick);
            canvas.addEventListener('mousemove', handleMouseMove);
            clearInterval(intervalId);
        };

    }, [menuButton, detailValue, data]);

    const updateDetailValue = () => {
        if(data){
            // Filter the data based on refPrefix (e.g., "L103")
            const filteredData =  data.filter(item => item.tname.includes(refPrefix));
        
            // console.log('filteredData', filteredData)
            // Update the labels array where tag matches the last part of tname (e.g., "T01")
            const updatedValue = detailValues.map(data => {
              const matchingData = filteredData.find(item => item.tname.endsWith(data.tag));
              return matchingData != undefined ? { ...data, value: matchingData.tvalue } : data;
            });
        
            setDetailValue(updatedValue);
        }
    };

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }} />
        </div>
    );
};