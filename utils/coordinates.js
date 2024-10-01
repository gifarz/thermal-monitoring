export const menuButton = [
    { label: 'ARCHITECTURE', x: 0.18, y: 0.93, width: 0.101, height: 0.052, href: '/architecture' },
    { label: 'OVERVIEW', x: 0.288, y: 0.93, width: 0.101, height: 0.052, href: '/overview' },
    { label: 'ALARM', x: 0.396, y: 0.93, width: 0.101, height: 0.052, href: '/alarm' },
    { label: 'TREND', x: 0.504, y: 0.93, width: 0.101, height: 0.052, href: '/trending' },
    { label: 'LOG', x: 0.612, y: 0.93, width: 0.101, height: 0.052, href: '/logging' },
    { label: 'SETTING', x: 0.720, y: 0.93, width: 0.101, height: 0.052, href: '/setting' },
];

export const indicatorLampFlag = [
    { x: 0.927, y: 0.132, flag: 'danger', color: 'red' },
    { x: 0.927, y: 0.163, flag: 'warning', color: 'yellow' },
    { x: 0.927, y: 0.194, flag: 'normal', color: 'green' },
    { x: 0.927, y: 0.226, flag: 'disconnected', color: 'white' },
]

// Define positions for each label (T01 - T12)
export const detailValues = [
    { value: '...', x: 0.047, y: 0.302, width: 0.05, height: 0.1, tag: 'T01' }, // T01
    { value: '...', x: 0.047, y: 0.363, width: 0.05, height: 0.1, tag: 'T02' }, // T02
    { value: '...', x: 0.047, y: 0.426, width: 0.05, height: 0.1, tag: 'T03' }, // T03

    { value: '...', x: 0.563, y: 0.302, width: 0.05, height: 0.1, tag: 'T04' }, // T04
    { value: '...', x: 0.563, y: 0.381, width: 0.05, height: 0.1, tag: 'T05' }, // T05
    { value: '...', x: 0.563, y: 0.463, width: 0.05, height: 0.1, tag: 'T06' }, // T06

    { value: '...', x: 0.563, y: 0.64, width: 0.05, height: 0.1, tag: 'T07' }, // T07
    { value: '...', x: 0.563, y: 0.72, width: 0.05, height: 0.1, tag: 'T08' }, // T08
    { value: '...', x: 0.563, y: 0.79, width: 0.05, height: 0.1, tag: 'T09' }, // T09

    { value: '...', x: 0.047, y: 0.595, width: 0.05, height: 0.1, tag: 'T10' }, // T10
    { value: '...', x: 0.047, y: 0.665, width: 0.05, height: 0.1, tag: 'T11' }, // T11
    { value: '...', x: 0.047, y: 0.735, width: 0.05, height: 0.1, tag: 'T12' }, // T12
];

export const detailValuesV2 = [
    { value: '...', x: 0.072, y: 0.353, width: 0.05, height: 0.1, tag: 'T01' }, // T01
    { value: '...', x: 0.072, y: 0.415, width: 0.05, height: 0.1, tag: 'T02' }, // T02
    { value: '...', x: 0.072, y: 0.474, width: 0.05, height: 0.1, tag: 'T03' }, // T03

    { value: '...', x: 0.6, y: 0.352, width: 0.05, height: 0.1, tag: 'T04' }, // T04
    { value: '...', x: 0.6, y: 0.434, width: 0.05, height: 0.1, tag: 'T05' }, // T05
    { value: '...', x: 0.6, y: 0.515, width: 0.05, height: 0.1, tag: 'T06' }, // T06

    { value: '...', x: 0.6, y: 0.69, width: 0.05, height: 0.1, tag: 'T07' }, // T07
    { value: '...', x: 0.6, y: 0.77, width: 0.05, height: 0.1, tag: 'T08' }, // T08
    { value: '...', x: 0.6, y: 0.84, width: 0.05, height: 0.1, tag: 'T09' }, // T09

    { value: '...', x: 0.072, y: 0.645, width: 0.05, height: 0.1, tag: 'T10' }, // T10
    { value: '...', x: 0.072, y: 0.716, width: 0.05, height: 0.1, tag: 'T11' }, // T11
    { value: '...', x: 0.072, y: 0.786, width: 0.05, height: 0.1, tag: 'T12' }, // T12
];

export const exportChartToImage = [
    { label: 'Export Chart', x: 0.865, y: 0.285, width: 0.07, height: 0.05 },
];

// PANEL VARIABLE
export const fixWidth = 0.02
export const fixHeight = 0.02
export const initXValue = 0.24
export const initXValue2 = 0.051
export const fibbXValue = 0.067

// TOP PANEL Y VALUE
export const minYValue = 0.487
export const maxYValue = 0.505
export const avgYValue = 0.521

// BOTTOM PANEL Y VALUE
export const minYValue2 = 0.829
export const maxYValue2 = 0.846
export const avgYValue2 = 0.863

// INDICATOR LAMP
export const radiusIndicator = 100
export const startAngleIndicator = 0
export const endAngleIndicator = 2 * Math.PI;  // End angle (2π is a full circle)
export const setATHHH = 45
export const setATHH = 35

export const listGroupTags = ["L102","L103","L104","L105","L202","L203","L204","L205","L209","L210","L212","L213","L215","L216","L217","L219","L220","L221","L223","L224"]

export const listTags = ["T01","T02","T03","T04","T05","T06","T07","T08","T09","T10","T11","T12"]

export const headerLogger = ["timestamp","T01","T02","T03","T04","T05","T06","T07","T08","T09","T10","T11","T12"]

export const listStatus = ["All","Ack","Active","Normal"]

export const headerAlarm = ["timestamp","alarmid","status"]
