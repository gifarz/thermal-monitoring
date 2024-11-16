'use client'

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { menuButton } from '@/utils/coordinates';
import { parseAbsoluteToLocal } from "@internationalized/date";
import useSWR, { mutate } from 'swr';
import dynamic from 'next/dynamic';
// import { fetchTlgLogging } from '@/pages/api/general/fetchTlgLogging';
import { formattedDate } from '@/utils/convertTimestamp';

const TableLoggerComp = dynamic(() => import('@/components/TableLoggerComp'), {
  loading: () => <p className='flex justify-center'>Generating Component...</p>, // Optional: You can show a fallback component while loading
})

const LoginComp = dynamic(() => import('@/components/LoginComp'))

export default function page() {
  const canvasRef = useRef(null);
  const router = useRouter(); // Initialize the router

  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [site, setSite] = useState();
  const [childGroupTags, setChildGroupTags] = useState();
  const [childTags, setChildTags] = useState();
  const [imageGenerated, setImageGenerated] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // PAGINATION
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [loading, setLoading] = useState(false);
  const [bodyList, setBodyList] = useState([]);

  // const { data: dataLogging, error: errorLogging, isLoading: isLoadingLogging } = useSWR(
  //   site && childGroupTags && fromDate && toDate && page ? `/api/general/fetchTlgLogging` : null,  // A key that changes dynamically
  //   () => fetchTlgLogging(`${site}+${childGroupTags}+${fromDate}+${toDate}+${page}+${limit}`),  // Function call inside the fetcher
  //   {
  //     refreshInterval: 1000
  //   }
  // );

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
  const handleSite = (currSite) => {

    if (currSite.toLowerCase() !== site?.toLowerCase()) {

      setBodyList([])
    }

    setSite(currSite); // Updating parent state with data from child
  };

  const handleChildGroupTags = (group) => {

    const groupTag = group.replaceAll(' ', '')

    setChildGroupTags(groupTag); // Updating parent state with data from child
  };

  const handleChildTags = (data) => {

    setChildTags(data); // Updating parent state with data from child
  };

  // FOR INFINITE SCROLL AND REFETCHING DATA
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (!loading && scrollTop + clientHeight >= scrollHeight - 5) {
      setPage((prevPage) => prevPage + 1);
      setLoading(true)
    }
  };

  useEffect(() => {

    // Format the date objects into 'yyyy-MM-dd HH:mm:ss' format
    const from = `${date.start.year}-${padZero(date.start.month)}-${padZero(date.start.day)} ` +
      `${padZero(date.start.hour)}:${padZero(date.start.minute)}:${padZero(date.start.second)}`;

    const to = `${date.end.year}-${padZero(date.end.month)}-${padZero(date.end.day)} ` +
      `${padZero(date.end.hour)}:${padZero(date.end.minute)}:${padZero(date.end.second)}`;

    // Convert to ISO String and set state
    setFromDate(new Date(`${from}`).toISOString());
    setToDate(new Date(`${to}`).toISOString());

    const fetchData = async () => {

      if(!site && !childGroupTags && !fromDate && !toDate) return;

      setLoading(true)
      try {
        const response = await fetch(`/api/general/fetchTlgLogging?site=${site}&tlg=${childGroupTags}&gte=${fromDate}&lte=${toDate}&page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();
        const dataList = result.map(item => {
          if (item.timestamp) {
            const dateObject = new Date(item.timestamp);  // Convert to Date object
            const timestamp = formattedDate(dateObject)
  
            return {
              ...item,
              timestamp: timestamp  // Update the timestamp format
            };
          }
          return item;  // Return item even if there's no valid timestamp
        });
  
        setBodyList(dataList)

      } catch (err) {
        console.log('err', err.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // if (dataLogging && dataLogging.length > 0) {

    //   const dataList = dataLogging.map(item => {
    //     if (item.timestamp) {
    //       const dateObject = new Date(item.timestamp);  // Convert to Date object
    //       const timestamp = formattedDate(dateObject)

    //       return {
    //         ...item,
    //         timestamp: timestamp  // Update the timestamp format
    //       };
    //     }
    //     return item;  // Return item even if there's no valid timestamp
    //   });

    //   setBodyList(dataList)

    //   // setBodyList(prevData => {

    //   //   const filteredDuplicateData = dataList.filter(
    //   //     newItem => !prevData.some(existingItem => existingItem.id === newItem.id)
    //   //   );

    //   //   return [...prevData, ...filteredDuplicateData];
    //   // });

    //   // setNewBodyList(() => {
    //   //   return bodyList.filter(item => {

    //   //     const prefixesGroup = childGroupTags.split(',')

    //   //     const hasAnyPrefixKey = prefixesGroup.some(prefix =>
    //   //       Object.keys(item).some(key => key.startsWith(prefix))
    //   //     );

    //   //     return hasAnyPrefixKey

    //   //   })
    //   // })

    //   // console.log('newBodyList', newBodyList)

    //   setLoading(false)
    // }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let imgAspectRatio = 1; // Default aspect ratio

    const bgImage = new Image();
    bgImage.src = `/data-logger.webp`;

    const resizeCanvas = () => {
      // Ensure the image is loaded before calculating dimensions
      if (!bgImage.complete) return;
      setImageGenerated(true)

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
          // Clear cache for a specific key (API endpoint)
          mutate('/api/general/fetchTlgLogging', null, false);

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
  }, [menuButton, date, fromDate, toDate, site, childGroupTags, childTags]);

  console.log('bodyList', bodyList)
  console.log('fromDate', fromDate)
  console.log('toDate', toDate)

  const tableMaxHeight = canvasSize.height * 0.7
  const tableMaxWidth = canvasSize.width * 0.95
  const tableMinWidth = canvasSize.width * 0.9
  const tableMarginTop = canvasSize.height * 0.15

  return (
    <>
      <div style={{ width: '100%', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div
          // onScroll={handleScroll}
          className='absolute w-1/2 z-10 overflow-y-hidden overflow-x-hidden left-1/2 mt-10 px-2'
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
              <TableLoggerComp site={handleSite} loading={loading} sendTagValue={handleChildTags} sendGroupTagValue={handleChildGroupTags} bodyList={bodyList} date={date} setDate={setDate} isLoading={loading} />
              :
              undefined
          }
        </div>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
      </div>

      <LoginComp />
    </>
  );
}