import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartDetail = (props) => {
    const chartRef = React.useRef(null);

    React.useEffect(() => {
        const chartInstance = chartRef.current;
        if (chartInstance) {
            // Force fixed dimensions on canvas
            const canvas = chartInstance.canvas;
            canvas.style.width = '350px';
            canvas.style.height = '425px';
        }
    })

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
        labels: [0, 10, 20, 30],
        datasets: [
            {
                label: `T01`,
                data: [0, 5],
                borderColor: 'white',
                tension: 0.1,
            },
            {
                label: `T02`,
                data: [0, 10],
                borderColor: 'black',
                tension: 0.1,
            },
            {
                label: `T03`,
                data: [0, 15],
                borderColor: 'red',
                tension: 0.1,
            },
            {
                label: `T04`,
                data: [0, 20],
                borderColor: 'blue',
                tension: 0.1,
            },
            {
                label: `T05`,
                data: [0, 25],
                borderColor: 'yellow',
                tension: 0.1,
            },
            {
                label: `T06`,
                data: [0, 27],
                borderColor: 'grey',
                tension: 0.1,
            },
            {
                label: `T07`,
                data: [0, 29],
                borderColor: 'purple',
                tension: 0.1,
            },
            {
                label: `T08`,
                data: [0, 30],
                borderColor: 'cyan',
                tension: 0.1,
            },
            {
                label: `T09`,
                data: [0, 32],
                borderColor: 'green',
                tension: 0.1,
            },
            {
                label: `T10`,
                data: [0, 33],
                borderColor: 'orange',
                tension: 0.1,
            },
            {
                label: `T11`,
                data: [0, 40],
                borderColor: 'pink',
                tension: 0.1,
            },
            {
                label: `T12`,
                data: [0, 45],
                borderColor: 'lime',
                tension: 0.1,
            },
        ],
    };

    // Configuration options for the chart
    const options = {
        responsive: true,
        maintainAspectRatio: false,  // Allows setting custom aspect ratio
        plugins: {
            legend: {
                position: 'bottom'
            },
            title: {
                display: false,
                text: 'Detail Chart',
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                type: 'category',
                title: {
                    display: true,
                    text: 'Time',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Value',
                },
            },
        },
    };

    return (
        // <div>
            <Line ref={chartRef} data={data} options={options} />
        // </div>
    )
}

export default ChartDetail;
