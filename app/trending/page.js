'use client'

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { menuButtonV2 as menuButton } from '@/utils/coordinates';
import { parseAbsoluteToLocal } from "@internationalized/date";
import { selectTlgDonggi } from '@/pages/api/selectDonggiData';
import useSWR from 'swr';

import dynamic from 'next/dynamic';

const ChartTrending = dynamic(() => import('@/components/ChartTrending'), {
    loading: () => <p>Loading...</p>, // Optional: You can show a fallback component while loading
})

export default function page() {
    const canvasRef = useRef(null);
    const router = useRouter(); // Initialize the router
    const [imageGenerated, setImageGenerated] = useState(false);
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [childGroupTags, setChildGroupTags] = useState('L102');
    const [dataList, setDataList] = useState([]);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

    const { data, error, isLoading } = useSWR(
        childGroupTags && fromDate && toDate ? `/api/selectDonggiData` : null,  // A key that changes dynamically
        () => selectTlgDonggi(`${childGroupTags}+${fromDate}+${toDate}`),  // Function call inside the fetcher
        { refreshInterval: 1000 }
    );

    const currentDateISO = new Date().toISOString();

    // Add a specific end date or duration (e.g., 7 days after the start date)
    const backDate = new Date();
    backDate.setDate(backDate.getDate() - 1); // Example: past 1 day
    const backDateISO = backDate.toISOString();

    let [date, setDate] = useState({
        start: parseAbsoluteToLocal(backDateISO),
        end: parseAbsoluteToLocal(currentDateISO)
    });

    // Helper function to pad single digits with leading zeros
    const padZero = (num) => String(num).padStart(2, '0');

    // Callback function that will be passed to the child
    const handleChildGroupTags = (group) => {
        // console.log('Child Group in function', group.replaceAll(' ', ''))
        const groupTag = group.replaceAll(' ', '')

        setChildGroupTags(groupTag); // Updating parent state with data from child
    };

    useEffect(() => {

        if (data && data.length > 0 && data.every(item => !item.hasOwnProperty('alarmid'))) {
            const newData = data.map(item => {
                if (item.timestamp) {
                    const dateObject = new Date(item.timestamp);  // Convert to Date object
                    const formattedDate = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}-${dateObject.getDate()
                            .toString()
                            .padStart(2, '0')} ${dateObject.getHours()
                                .toString()
                                .padStart(2, '0')}:${dateObject.getMinutes()
                                    .toString()
                                    .padStart(2, '0')}:${dateObject.getSeconds().toString().padStart(2, '0')}`;

                    return {
                        ...item,
                        timestamp: formattedDate  // Update the timestamp format
                    };
                }
                return item;  // Return item even if there's no valid timestamp
            });

            setDataList(newData);  // Update dataList state with the processed data
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let imgAspectRatio = 1; // Default aspect ratio

        const bgImage = new Image();
        bgImage.src = `/donggi/v2/trending.webp`;

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

            // Format the date objects into 'yyyy-MM-dd HH:mm:ss' format
            const from = `${date.start.year}-${padZero(date.start.month)}-${padZero(date.start.day)} ` +
                `${padZero(date.start.hour)}:${padZero(date.start.minute)}:${padZero(date.start.second)}`;

            const to = `${date.end.year}-${padZero(date.end.month)}-${padZero(date.end.day)} ` +
                `${padZero(date.end.hour)}:${padZero(date.end.minute)}:${padZero(date.end.second)}`;

            // Convert to ISO String and set state
            setFromDate(new Date(`${from}`).toISOString());
            setToDate(new Date(`${to}`).toISOString());
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
    }, [menuButton, date, fromDate, toDate, data]);

    const minWidth = canvasSize.width * 0.67;
    const marginTop = canvasSize.height * 0.22;

    // console.log('childData', childData)
    // console.log('fromDate', fromDate)
    // console.log('toDate', toDate)
    // console.log('dataList', dataList)

    return (
        <div style={{ width: '100%', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
            <div
                className='absolute w-1/2 z-10 left-1/2'
                style={{
                    overflow: 'auto',
                    transform: 'translate(-50%, 0)',
                    // minHeight: '50%',
                    minWidth: minWidth,
                    top: marginTop
                }}
            >
                {
                    imageGenerated ?
                        <ChartTrending sendGroupTagValue={handleChildGroupTags} dataList={dataList} date={date} setDate={setDate} isLoading={isLoading} />
                        :
                        undefined
                }
            </div>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
        </div>
    );
}