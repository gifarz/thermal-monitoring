'use client'
import React from 'react';

function page(props) {

    const [screenSize, setScreenSize] = React.useState({ width: 0, height: 0 });

    React.useEffect(() => {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
    
        console.log(`Screen width: ${screenWidth}px`);
        console.log(`Screen height: ${screenHeight}px`);

        setScreenSize({ width: screenWidth, height: screenHeight });

    })

    return (
        <div className='w-screen h-screen'>
            <div 
            style={{maxWidth: screenSize.width+'px', maxHeight: screenSize.height+'px'}}
            className="bg-[url('/overview.png')] bg-contain bg-center bg-no-repeat text-black"
            >
            </div>
        </div>
    );
}

export default page;