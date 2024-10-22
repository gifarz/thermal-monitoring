'use client'

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DateRangePicker
} from "@nextui-org/react";
import { ChevronDownIcon } from "../../components/ChevronDownIcon";
import { I18nProvider } from "@react-aria/i18n";
import { menuButton, listSites, groupAlarm, tagAlarmDonggi, tagAlarmMatindok } from '@/utils/coordinates';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { siteLocalStorage } from '@/utils/siteLocalStorage';
import { selectActiveAlarmDonggi } from "@/pages/api/donggi/selectActiveAlarm";
import { selectActiveAlarmMatindok } from "@/pages/api/matindok/selectActiveAlarm";
import { selectHistoryAlarmMatindok } from '@/pages/api/matindok/selectHistoryAlarm';
import { selectHistoryAlarmDonggi } from '@/pages/api/donggi/selectHistoryAlarm';
import { parseAbsoluteToLocal } from "@internationalized/date";

const TableActiveAlarm = dynamic(() => import('@/components/TableActiveAlarm'))
const TableHistoricalAlarm = dynamic(() => import('@/components/TableHistoricalAlarm'))

export default function page() {
  const canvasRef = useRef(null);
  const router = useRouter(); // Initialize the router
  const [imageGenerated, setImageGenerated] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [siteActive, setSiteActive] = useState("Donggi")
  const [siteHistory, setSiteHistory] = useState("Donggi")
  const [groupValue, setGroupValue] = useState(new Set(["Danger"]));
  const [tagValue, setTagValue] = useState(new Set([]));
  const [tagValueDonggi, setTagValueDonggi] = useState(new Set(["L102_T01"]));
  const [tagValueMatindok, setTagValueMatindok] = useState(new Set(["L01_T01"]));
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const selectedGroup = useMemo(
    () => Array.from(groupValue).join(", ").replaceAll("_", " "),
    [groupValue]
  );

  const selectedTag = useMemo(
    () => Array.from(siteHistory.toLowerCase() == 'donggi' ? tagValueDonggi:tagValueMatindok).join(", "),
    [siteHistory.toLowerCase() == 'donggi' ? tagValueDonggi:tagValueMatindok]
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

  // ============== ACTIVE ALARM SCOPE ==============
  const {
    data: dataActiveAlarmDonggi,
    error: errorActiveAlarmDonggi,
    isLoading: isLoadingActiveAlarmDonggi
  } = useSWR(
    `/api/donggi/selectActiveAlarm`, selectActiveAlarmDonggi,
    { refreshInterval: 1000 }
  );

  const {
    data: dataActiveAlarmMatindok,
    error: errorActiveAlarmMatindok,
    isLoading: isLoadingActiveAlarmMatindok
  } = useSWR(
    `/api/matindok/selectActiveAlarm`, selectActiveAlarmMatindok,
    { refreshInterval: 1000 }
  );
  // ============== ACTIVE ALARM SCOPE ==============

  // ============== HISTORY ALARM SCOPE ==============
  const {
    data: dataHistoryAlarmDonggi,
    error: errorHistoryAlarmDonggi,
    isLoading: isLoadingHistoryAlarmDonggi
  } = useSWR(
    fromDate && toDate ? `/api/donggi/selectHistoryAlarm` : null,
    () => selectHistoryAlarmDonggi(`${fromDate}+${toDate}`),
    { refreshInterval: 1000 }
  );

  const {
    data: dataHistoryAlarmMatindok,
    error: errorHistoryAlarmMatindok,
    isLoading: isLoadingHistoryAlarmMatindok
  } = useSWR(
    fromDate && toDate ? `/api/matindok/selectHistoryAlarm` : null,
    () => selectHistoryAlarmMatindok(`${fromDate}+${toDate}`),
    { refreshInterval: 1000 }
  );
  // ============== HISTORY ALARM SCOPE ==============

  const handleSetSiteActive = (e) => {
    setSiteActive(() => {
      return e.currentKey
    })
  }

  const handleSetSiteHistory = (e) => {
    setSiteHistory(() => {
      return e.currentKey
    })
  }

  // Helper function to pad single digits with leading zeros
  const padZero = (num) => String(num).padStart(2, '0');

  useEffect(() => {

    setTagValue(()=> {
      return siteHistory.toLowerCase() == 'donggi' ? tagValueDonggi:tagValueMatindok
    })

    // Format the date objects into 'yyMMddHHmmss' format
    const from = `${date.start.year}${padZero(date.start.month)}${padZero(date.start.day)}` +
      `${padZero(date.start.hour)}${padZero(date.start.minute)}${padZero(date.start.second)}`;

    const to = `${date.end.year}${padZero(date.end.month)}${padZero(date.end.day)}` +
      `${padZero(date.end.hour)}${padZero(date.end.minute)}${padZero(date.end.second)}`;

    setFromDate(from.substring(2));
    setToDate(to.substring(2));
    // Format the date objects into 'yyMMddHHmmss' format

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
  }, [menuButton, date, fromDate, toDate, tagValue, tagValueDonggi, tagValueMatindok]);

  const tableMaxHeight = canvasSize.height * 0.65
  const tableMaxWidth = canvasSize.width * 0.95
  const tableMinWidth = canvasSize.width * 0.9
  const tableMarginTop = canvasSize.height * 0.17

  // console.log('tableMaxHeight',tableMaxHeight)
  // console.log('tableMaxWidth',tableMaxWidth)
  // console.log('dataAlarmTags',dataAlarmTags)
  // console.log('dataAlg',dataAlg)
  // console.log('newHistorical', newHistorical)

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
            <div className="flex flex-col">
              <Tabs
                aria-label="Options"
              >
                <Tab key="active" title="Active Alarms">
                  <Card>
                    <div className="w-1/3 flex my-2 px-2">
                      <Dropdown
                        className="w-full"
                      >
                        <DropdownTrigger className="hidden sm:flex">
                          <Button
                            endContent={<ChevronDownIcon className="text-small" />}
                            variant="flat"
                            className="bg-white min-h-full"
                            style={{
                              fontSize: "14px",
                              maxHeight: "50px"
                            }}
                          >
                            {siteActive}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          disallowEmptySelection
                          aria-label="Table Columns"
                          closeOnSelect={true}
                          selectedKeys={siteActive}
                          selectionMode="single"
                          onSelectionChange={handleSetSiteActive}
                        >
                          {listSites.map((site, index) => (
                            <DropdownItem key={site}>
                              {site}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <CardBody>
                      <TableActiveAlarm
                        dataActiveAlarm={
                          siteActive.toLowerCase() == 'donggi' ? dataActiveAlarmDonggi : dataActiveAlarmMatindok
                        }
                        isLoadingActiveAlarm={
                          siteActive.toLowerCase() == 'donggi' ? isLoadingActiveAlarmDonggi : isLoadingActiveAlarmMatindok
                        }
                      />
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="historical" title="Historical Alarms">
                  <Card>
                    <div className="w-full flex justify-between items-center gap-3 my-4 px-2">
                      <div className="flex gap-3">
                        <Dropdown
                          className="h-full"
                        >
                          <DropdownTrigger className="hidden sm:flex">
                            <Button
                              endContent={<ChevronDownIcon className="text-small" />}
                              variant="flat"
                              className="bg-white min-h-full"
                              style={{
                                fontSize: "14px",
                                maxHeight: "50px"
                              }}
                            >
                              {siteHistory}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={true}
                            selectedKeys={siteHistory}
                            selectionMode="single"
                            onSelectionChange={handleSetSiteHistory}
                          >
                            {listSites.map((site, index) => (
                              <DropdownItem key={site}>
                                {site}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>

                        <Dropdown>
                          <DropdownTrigger className="hidden sm:flex">
                            <Button
                              endContent={<ChevronDownIcon className="text-small" />}
                              variant="flat"
                              className="bg-white min-h-full"
                            >
                              {
                                selectedGroup.split(',').length > 1 ?
                                  selectedGroup.split(',').length + ' Groups'
                                  :
                                  selectedGroup.split(',')[0]
                              }
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={groupValue}
                            selectionMode="multiple"
                            onSelectionChange={setGroupValue}
                            className="max-h-40 overflow-y-auto"
                          >
                            {groupAlarm.map((groupAlarm, index) => (
                              <DropdownItem key={groupAlarm}>
                                {groupAlarm}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>

                        <Dropdown>
                          <DropdownTrigger className="hidden sm:flex">
                            <Button
                              endContent={<ChevronDownIcon className="text-small" />}
                              variant="flat"
                              className="bg-white min-h-full"
                            >
                              {
                                selectedTag.split(',').length > 1 ?
                                  selectedTag.split(',').length + ' Tags'
                                  :
                                  selectedTag.split(',')[0]
                              }
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={siteHistory.toLowerCase() == 'donggi' ? tagValueDonggi:tagValueMatindok}
                            selectionMode="multiple"
                            onSelectionChange={siteHistory.toLowerCase() == 'donggi' ? setTagValueDonggi:setTagValueMatindok}
                            className="max-h-40 overflow-y-auto"
                          >
                            {
                              siteHistory.toLowerCase() == "donggi" ?
                                tagAlarmDonggi.map((tag, index) => (
                                  <DropdownItem key={tag}>
                                    {tag}
                                  </DropdownItem>
                                ))
                                :
                                tagAlarmMatindok.map((tag, index) => (
                                  <DropdownItem key={tag}>
                                    {tag}
                                  </DropdownItem>
                                ))
                            }
                          </DropdownMenu>
                        </Dropdown>

                        <div className="grow flex flex-col gap-4">
                          <I18nProvider locale="id-ID">
                            <DateRangePicker label="Date Range Filter" value={date} onChange={setDate} />
                          </I18nProvider>
                        </div>
                      </div>
                    </div>

                    <CardBody>
                      <TableHistoricalAlarm
                        selectedGroup={selectedGroup}
                        selectedTag={selectedTag}
                        dataHistoryAlarm={
                          siteHistory.toLowerCase() == 'donggi' ? dataHistoryAlarmDonggi : dataHistoryAlarmMatindok
                        }
                        isLoadingHistoryAlarm={
                          siteHistory.toLowerCase() == 'donggi' ? isLoadingHistoryAlarmDonggi : isLoadingHistoryAlarmMatindok
                        }
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
