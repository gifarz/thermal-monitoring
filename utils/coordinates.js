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
export const maxYValue = 0.504
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

// Table Logger
export const listGroupTags = ["L102", "L103", "L104", "L105", "L202", "L203", "L204", "L205", "L209", "L210", "L212", "L213", "L215", "L216", "L217", "L219", "L220", "L221", "L223", "L224"]

export const listTags = ["T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09", "T10", "T11", "T12"]

export const headerLogger = ["timestamp", "T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09", "T10", "T11", "T12"]

// Table Active Alarm
export const listStatus = ["All", "Ack", "Active", "Normal"]

export const headerAlarm = ["timestamp", "alarmid", "status"]

// Table Historical Alarm
export const headerHistoricalAlarm = ["timestamp", "alarmid", "group", "tag", "text", "status"]
export const groupAlarm = ["Danger","Warning","Event"]
export const tagAlarm = ["L102_T01","L102_T02","L102_T03","L102_T04","L102_T05","L102_T06","L102_T07","L102_T08","L102_T09","L102_T10","L102_T11","L102_T12","L103_T01","L103_T02","L103_T03","L103_T04","L103_T05","L103_T06","L103_T07","L103_T08","L103_T09","L103_T10","L103_T11","L103_T12","L104_T01","L104_T02","L104_T03","L104_T04","L104_T05","L104_T06","L104_T07","L104_T08","L104_T09","L104_T10","L104_T11","L104_T12","L105_T01","L105_T02","L105_T03","L105_T04","L105_T05","L105_T06","L105_T07","L105_T08","L105_T09","L105_T10","L105_T11","L105_T12","L202_T01","L202_T02","L202_T03","L202_T04","L202_T05","L202_T06","L202_T07","L202_T08","L202_T09","L202_T10","L202_T11","L202_T12","L203_T01","L203_T02","L203_T03","L203_T04","L203_T05","L203_T06","L203_T07","L203_T08","L203_T09","L203_T10","L203_T11","L203_T12","L204_T01","L204_T02","L204_T03","L204_T04","L204_T05","L204_T06","L204_T07","L204_T08","L204_T09","L204_T10","L204_T11","L204_T12","L205_T01","L205_T02","L205_T03","L205_T04","L205_T05","L205_T06","L205_T07","L205_T08","L205_T09","L205_T10","L205_T11","L205_T12","L209_T01","L209_T02","L209_T03","L209_T04","L209_T05","L209_T06","L209_T07","L209_T08","L209_T09","L209_T10","L209_T11","L209_T12","L210_T01","L210_T02","L210_T03","L210_T04","L210_T05","L210_T06","L210_T07","L210_T08","L210_T09","L210_T10","L210_T11","L210_T12","L212_T01","L212_T02","L212_T03","L212_T04","L212_T05","L212_T06","L212_T07","L212_T08","L212_T09","L212_T10","L212_T11","L212_T12","L213_T01","L213_T02","L213_T03","L213_T04","L213_T05","L213_T06","L213_T07","L213_T08","L213_T09","L213_T10","L213_T11","L213_T12","L215_T01","L215_T02","L215_T03","L215_T04","L215_T05","L215_T06","L215_T07","L215_T08","L215_T09","L215_T10","L215_T11","L215_T12","L216_T01","L216_T02","L216_T03","L216_T04","L216_T05","L216_T06","L216_T07","L216_T08","L216_T09","L216_T10","L216_T11","L216_T12","L217_T01","L217_T02","L217_T03","L217_T04","L217_T05","L217_T06","L217_T07","L217_T08","L217_T09","L217_T10","L217_T11","L217_T12","L219_T01","L219_T02","L219_T03","L219_T04","L219_T05","L219_T06","L219_T07","L219_T08","L219_T09","L219_T10","L219_T11","L219_T12","L220_T01","L220_T02","L220_T03","L220_T04","L220_T05","L220_T06","L220_T07","L220_T08","L220_T09","L220_T10","L220_T11","L220_T12","L221_T01","L221_T02","L221_T03","L221_T04","L221_T05","L221_T06","L221_T07","L221_T08","L221_T09","L221_T10","L221_T11","L221_T12","L223_T01","L223_T02","L223_T03","L223_T04","L223_T05","L223_T06","L223_T07","L223_T08","L223_T09","L223_T10","L223_T11","L223_T12","L224_T01","L224_T02","L224_T03","L224_T04","L224_T05","L224_T06","L224_T07","L224_T08","L224_T09","L224_T10","L224_T11","L224_T12"]

// Switch Site
export const listSites = ["Donggi", "Matindok"]
