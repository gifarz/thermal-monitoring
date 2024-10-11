'use client'

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { menuButton } from '@/utils/coordinates';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { selectAlgDonggi } from '@/pages/api/donggi/selectAlg';
import { selectAlarmTagsDonggi } from '@/pages/api/donggi/selectAlarmTags';

const TableActiveAlarm = dynamic(() => import('@/components/TableActiveAlarm'))
const TableHistoricalAlarm = dynamic(() => import('@/components/TableHistoricalAlarm'))

export default function page() {
  const canvasRef = useRef(null);
  const router = useRouter(); // Initialize the router
  const [imageGenerated, setImageGenerated] = useState(false);
  const [childData, setChildData] = useState('All');
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [newHistorical, setNewHistorical] = useState([])

  const { data: dataAlg, error, isLoading } = useSWR(
    childData ? `/api/donggi/selectAlg` : null,
    () => selectAlgDonggi(childData),
    { refreshInterval: 1000 }
  );

  const { data: dataAlarmTags, error: errorAlarmTags, isLoading: isLoadingAlarmTags } = useSWR(
    `/api/donggi/selectAlarmTags`, selectAlarmTagsDonggi,
    { refreshInterval: 1000 }
  );

  let objectHistorical =
  {
    timestamp: "",
    alarmid: "",
    group: "",
    tag: "",
    text: "",
    status: ""
  }

  // Callback function that will be passed to the child
  const handleChildData = (data) => {
    // console.log('Child Data in function', data)
    setChildData(data); // Updating parent state with data from child
  };

  useEffect(() => {

    // Iterate over dataAlg
    dataAlg?.forEach(alg => {

      // Create a new object for historical data
      let updatedHistorical = {
        ...objectHistorical
      };

      // console.log('status', alg.status.toLowerCase())

      let tag = dataAlarmTags?  dataAlarmTags[alg.alarmid] : undefined

      // Iterate over dataHistorical to match alarmid
      dataAlarmTags?.forEach(item => {

        // console.log('include constant', item.constant.includes(alg.status.toLowerCase()))

        if (item.id == alg.alarmid) {

          // console.log('masuk', item)
          updatedHistorical = {
            ...updatedHistorical,
            timestamp: alg.timestamp,
            alarmid: alg.alarmid,
            status: alg.status,
            group: item.group,
            text: item.text,
            tag: item.tag
          };

          // Update the state with the new objectHistorical
          setNewHistorical(prevValue => [...prevValue, updatedHistorical]);
        }

      });

    });


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
  }, [menuButton, dataAlg, dataAlarmTags]);

  const tableMaxHeight = canvasSize.height * 0.65
  const tableMaxWidth = canvasSize.width * 0.95
  const tableMinWidth = canvasSize.width * 0.9
  const tableMarginTop = canvasSize.height * 0.17

  // console.log('tableMaxHeight',tableMaxHeight)
  // console.log('tableMaxWidth',tableMaxWidth)
  // console.log('dataAlarmTags',dataAlarmTags)
  // console.log('dataAlg',dataAlg)
  console.log('newHistorical', newHistorical)

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
            <div className="flex w-full flex-col">
              <Tabs
                disabledKeys={['configuration']}
                aria-label="Options"
              >
                <Tab key="configuration" title="Alarm Configuration">
                  <Card>
                    <CardBody>
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="active" title="Active Alarms">
                  <Card>
                    <CardBody>
                      <TableActiveAlarm
                        sendStatus={handleChildData}
                        dataAlg={dataAlg}
                        isLoading={isLoading}
                      />
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="historical" title="Historical Alarms">
                  <Card>
                    <CardBody>
                      <TableHistoricalAlarm
                        sendStatus={handleChildData}
                        // dataAlg={dataAlg}
                        newHistorical={newHistorical}
                        isLoading={isLoading}
                      />
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </div>
            :
            undefined
        }
      </div>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
    </div>
  );
}
