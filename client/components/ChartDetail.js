import React, { forwardRef } from 'react';
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
            canvas.style.width = `${props.chartWidth}px`;
            canvas.style.height = `${props.chartHeight}px`;
        }

    })

    // console.log('props.chartValue', props.chartValue)
    // console.log('sensorData', sensorData)

    // Data configuration for the chart
    const data = {
        labels: [0, 10, 20, 30],
        datasets: props.chartValue
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
        <Line ref={chartRef} data={data} options={options} />
    )
}

export default ChartDetail;
