import Link from 'next/link';
import React from 'react';

function ButtonComp({screenWidth, screenHeight}) {

    // Set every button position using pageX pageY for different resolution
    const [overviewXY, setOverviewXY] = React.useState({ pageX: 0, pageY: 0 });
    const [alarmXY, setAlarmXY] = React.useState({ pageX: 0, pageY: 0 });
    const [trendXY, setTrendXY] = React.useState({ pageX: 0, pageY: 0 });
    const [logXY, setLogXY] = React.useState({ pageX: 0, pageY: 0 });
    const [settingXY, setSettingXY] = React.useState({ pageX: 0, pageY: 0 });

    React.useEffect(() => {
        // const screenWidth = window.screen.width;
        // const screenHeight = window.screen.height;
    
        console.log(`Screen width in ButtonComp: ${screenWidth}px`);
        console.log(`Screen height in ButtonComp: ${screenHeight}px`);

        const newOverviewX = screenWidth/1280 * 289
        const newOverviewY = screenHeight/720 * 663

        const newAlarmX = screenWidth/1280 * 419
        const newAlarmY = screenHeight/720 * 663

        const newTrendX = screenWidth/1280 * 549
        const newTrendY = screenHeight/720 * 663

        const newLogX = screenWidth/1280 * 679
        const newLogY = screenHeight/720 * 663

        const newSettingX = screenWidth/1280 * 809
        const newSettingY = screenHeight/720 * 663

        setOverviewXY({ pageX: newOverviewX, pageY: newOverviewY })
        setAlarmXY({ pageX: newAlarmX, pageY: newAlarmY })
        setTrendXY({ pageX: newTrendX, pageY: newTrendY })
        setLogXY({ pageX: newLogX, pageY: newLogY })
        setSettingXY({ pageX: newSettingX, pageY: newSettingY })
    }, [])

    return (
        <div>
            <Link href="/overview">
                <button
                    style={{ top: overviewXY.pageY + 'px', left: overviewXY.pageX + 'px' }}
                    className='absolute py-5 px-16 rounded-md cursor-pointer'>
                </button>
            </Link>
            <Link href="/alarm">
                <button
                    style={{ top: alarmXY.pageY + 'px', left: alarmXY.pageX + 'px' }}
                    className='absolute py-5 px-16 rounded-md cursor-pointer'>
                </button>
            </Link>
            <Link href="/trend">
                <button
                    style={{ top: trendXY.pageY + 'px', left: trendXY.pageX + 'px' }}
                    className='absolute py-5 px-16 rounded-md cursor-pointer'>
                </button>
            </Link>
            <Link href="/log">
                <button
                    style={{ top: logXY.pageY + 'px', left: logXY.pageX + 'px' }}
                    className='absolute py-5 px-16 rounded-md cursor-pointer'>
                </button>
            </Link>
            <Link href="/setting">
                <button
                    style={{ top: settingXY.pageY + 'px', left: settingXY.pageX + 'px' }}
                    className='absolute py-5 px-16 rounded-md cursor-pointer'>
                </button>
            </Link>
        </div>
    );
}

export default ButtonComp;