'use client'
import React from 'react';
import ButtonComp from '@/components/ButtonComp';

function page(props) {

    const [screenSize, setScreenSize] = React.useState({ width: 0, height: 0 });

    React.useEffect(() => {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
    
        console.log(`Screen width: ${screenWidth}px`);
        console.log(`Screen height: ${screenHeight}px`);

        setScreenSize({ width: screenWidth, height: screenHeight });

    }, [])

    const handlePageXY = async (e) => {
        console.log('pageX', e.pageX)
        console.log('pageY', e.pageY)
    }

    return (
        <div 
        style={{width: screenSize.width+'px', height: screenSize.height+'px'}}
        >
            <div 
            className="w-full h-full bg-[url('/trend.png')] bg-contain bg-center bg-no-repeat text-black"
            onClick={(e) => handlePageXY(e)}
            >
                {
                    screenSize.width !== 0 ?
                    <ButtonComp screenWidth={screenSize.width} screenHeight={screenSize.height}/>
                    :
                    ''
                }
            </div>
        </div>
    );
}

export default page;