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
import { donggiGroupTags, matindokGroupTags, listTags, listSites } from "@/utils/coordinates";
import zoomPlugin from 'chartjs-plugin-zoom';

// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

const ChartTrending = (props) => {
    const chartRef = React.useRef(null);
    const [donggiGroupTag, setDonggiGroupTag] = React.useState(new Set(["L102"]));
    const [matindokGroupTag, setMatindokGroupTag] = React.useState(new Set(["L01"]));
    const [tagValue, setTagValue] = React.useState(new Set(["T01"]));
    const [site, setSite] = React.useState("Donggi");

    React.useEffect(() => {
        const chartInstance = chartRef.current;
        if (chartInstance) {
            // Force fixed dimensions on canvas
            const canvas = chartInstance.canvas;
            canvas.style.width = `${props.chartWidth}px`;
            canvas.style.height = `${props.chartHeight}px`;
        }

    })

    // console.log('props.chartWidth', props.chartWidth)
    // console.log('props.chartHeight', props.chartHeight)

    const selectedGroupTag = React.useMemo(
        () => Array.from(site.toLowerCase() == 'donggi' ? donggiGroupTag : matindokGroupTag).join(", ").replaceAll("_", " "),
        [site.toLowerCase() == 'donggi' ? donggiGroupTag : matindokGroupTag]
    );

    const selectedTag = React.useMemo(
        () => Array.from(tagValue).join(", ").replaceAll("_", " "),
        [tagValue]
    );

    props.sendGroupTagValue(selectedGroupTag)

    const handleSetSite = (e) => {
        setSite(() => {
            const newSite = e.currentKey
            // props.sendSite(e.currentKey)
            return newSite
        })
    }

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
            if (key.match(/^L\d{3}_T\d{2}$/) || key.match(/^L\d{2}_T\d{2}$/)) {

                const newKey = key.split('_')[1]
                selectedTag.replaceAll(' ', '').split(',').map(tag => {

                    if (newKey === tag) {
                        // If this is the first time encountering this key, initialize an array for it
                        if (!sensorData[key]) {
                            sensorData[key] = [];
                        }
                        // Push the corresponding value into the respective array
                        sensorData[key].push(entry[key]);
                    }
                })
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

    const datasetArray = []
    const borderColors = [
        "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige",
        "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown",
        "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue",
        "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod",
        "DarkGray", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen",
        "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen",
        "DarkSlateBlue", "DarkSlateGray", "DarkTurquoise", "DarkViolet",
        "DeepPink", "DeepSkyBlue", "DimGray", "DodgerBlue", "FireBrick",
        "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite",
        "Gold", "GoldenRod"
    ]

    for (const key in sensorData) {

        const randomIndex = Math.floor(Math.random() * borderColors.length)
        const pickedColor = borderColors[randomIndex]

        const datasetObject = {
            label: key,
            data: sensorData[key],
            borderColor: pickedColor,
            tension: 0.4,
        }

        // Remove the picked color from the list
        borderColors.splice(randomIndex, 1);

        datasetArray.push(datasetObject)

    }

    // Data configuration for the chart
    const data = {
        labels: timestamp,
        datasets: datasetArray
    };

    // Configuration options for the chart
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x', // allows panning in the x-axis
                },
                zoom: {
                    wheel: {
                        enabled: true, // Activate zoom on mouse wheel
                    },
                    pinch: {
                        enabled: true, // Enable pinch zooming on touch screens
                    },
                    mode: 'x', // Zoom only on the x-axis
                },
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
            <div className="flex items-center gap-3 mb-4">

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
                            {site}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Table Columns"
                        closeOnSelect={true}
                        selectedKeys={site}
                        selectionMode="single"
                        onSelectionChange={handleSetSite}
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
                                selectedGroupTag.split(',').length > 1 ?
                                    selectedGroupTag.split(',').length + ' Groups'
                                    :
                                    selectedGroupTag.split(',')[0]
                            }
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Table Columns"
                        closeOnSelect={false}
                        selectedKeys={
                            site.toLowerCase() == 'donggi' ? donggiGroupTag : matindokGroupTag

                        }
                        selectionMode="multiple"
                        onSelectionChange={
                            site.toLowerCase() == 'donggi' ? setDonggiGroupTag : setMatindokGroupTag
                        }
                        className="max-h-40 overflow-y-auto"
                    >
                        {
                        site.toLowerCase() == 'donggi' ? 
                        donggiGroupTags.map((groupTag, index) => (
                            <DropdownItem key={groupTag}>
                                {groupTag}
                            </DropdownItem>
                        ))
                        :
                        matindokGroupTags.map((groupTag, index) => (
                            <DropdownItem key={groupTag}>
                                {groupTag}
                            </DropdownItem>
                        ))
                        }
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
                        selectedKeys={tagValue}
                        selectionMode="multiple"
                        onSelectionChange={setTagValue}
                        className="max-h-40 overflow-y-auto"
                    >
                        {listTags.map((tag, index) => (
                            <DropdownItem key={tag}>
                                {tag}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                <div className="grow flex flex-col">
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
            <Line ref={chartRef} data={data} options={options} />
        </>
    )
}

export default ChartTrending;
