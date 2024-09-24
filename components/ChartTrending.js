import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import {
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DateRangePicker
} from "@nextui-org/react";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { I18nProvider } from "@react-aria/i18n";
import { listTags, headerLogger } from "@/utils/coordinates";

// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartTrending = (props) => {
    const chartRef = React.useRef(null);
    const [tagValue, setTagValue] = React.useState("L102");

    const handleSetTag = (e) => {
        setTagValue((prevValue) => { // The way to send realtime value to the parent
            const newValue = e.currentKey
            props.sendTagValue(newValue)
            return newValue
        })
    }

    // console.log(props.dataList)

    let timestamp = []

    // Initialize an object to store sensor arrays dynamically
    let sensorData = {};

    // Loop through the data
    props.dataList.forEach(entry => {
        // Push the timestamp
        timestamp.push(entry.timestamp);

        // Iterate over each key in the object
        Object.keys(entry).forEach(key => {
            // Validate if the key matches the pattern 'LXXX_TYY' (e.g., L102_T01, L103_T01)
            if (key.match(/^L\d{3}_T\d{2}$/)) {
                // If this is the first time encountering this key, initialize an array for it
                const newKey = key.split('_')[1]
                if (!sensorData[newKey]) {
                    sensorData[newKey] = [];
                }
                // Push the corresponding value into the respective array
                sensorData[newKey].push(entry[key]);
            }
        });
    });

    const handleSaveAsPNG = () => {
        const chart = chartRef.current;

        // Convert chart to Base64 Image
        const image = chart.toBase64Image();

        // Create a link element to download the image
        const link = document.createElement('a');
        link.href = image;
        link.download = `Trending Chart.png`; // Name the file as 'chart.png'
        link.click(); // Programmatically click the link to trigger download
    };

    // console.log('timestamp', timestamp)
    // console.log('sensorData', sensorData)

    // Data configuration for the chart
    const data = {
        labels: timestamp,
        datasets: [
            {
                label: `${tagValue}_T01`,
                data: sensorData.T01,
                borderColor: 'white',
                tension: 0.4,
            },
            {
                label: `${tagValue}_T02`,
                data: sensorData.T02,
                borderColor: 'black',
                tension: 0.4,
            },
            {
                label: `${tagValue}_T03`,
                data: sensorData.T03,
                borderColor: 'red',
                tension: 0.4,
            },
            {
                label: `${tagValue}_T04`,
                data: sensorData.T04,
                borderColor: 'blue',
                tension: 0.4,
            },
            {
                label: `${tagValue}_T05`,
                data: sensorData.T05,
                borderColor: 'yellow',
                tension: 0.4,
            },
            {
                label: `${tagValue}_T06`,
                data: sensorData.T06,
                borderColor: 'grey',
                tension: 0.4,
            },
            {
                label: `${tagValue}_T07`,
                data: sensorData.T07,
                borderColor: 'purple',
                tension: 0.4,
            },
            {
                label: `${tagValue}_T08`,
                data: sensorData.T08,
                borderColor: 'cyan',
                tension: 0.4,
            },
            {
                label: `${tagValue}_T09`,
                data: sensorData.T09,
                borderColor: 'green',
                tension: 0.4,
            },
            {
                label: `${tagValue}_T10`,
                data: sensorData.T10,
                borderColor: 'orange',
                tension: 0.4,
            },
            {
                label: `${tagValue}_T11`,
                data: sensorData.T11,
                borderColor: 'pink',
                tension: 0.4,
            },
            {
                label: `${tagValue}_T12`,
                data: sensorData.T12,
                borderColor: 'lime',
                tension: 0.4,
            },
        ],
    };

    // Configuration options for the chart
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            // title: {
            //     display: true,
            //     text: 'Trending',
            // },
        },
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Time',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Value',
                },
            },
        },
    };

    return (
        <>
            <div className="flex items-center gap-3 mb-4 px-40">
                <Dropdown className="h-full">
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
                            {tagValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Table Columns"
                        closeOnSelect={true}
                        selectedKeys={tagValue}
                        selectionMode="single"
                        onSelectionChange={handleSetTag}
                        
                    >
                        {listTags.map((tag, index) => (
                            <DropdownItem key={tag}
                            >
                                {tag}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                <div className="grow flex flex-col gap-4">
                    <I18nProvider locale="id-ID">
                        <DateRangePicker label="Date Range Filter" value={props.date} onChange={props.setDate} 
                        />
                    </I18nProvider>
                </div>

                <Button
                    variant="flat"
                    color="primary"
                    className="min-h-full text-white"
                    onClick={handleSaveAsPNG}
                    style={{
                        fontSize: "14px",
                        maxHeight: "50px",
                        minWidth: "100px"
                    }}
                >
                    Save as PNG
                </Button>
            </div>
            <Line ref={chartRef} data={data} options={options} />;
        </>
    )
}

export default ChartTrending;
