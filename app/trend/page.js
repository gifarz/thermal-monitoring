import React from 'react';

function page(props) {
    return (
        <div className='w-screen h-screen'>
            <div 
            style={{width: "1920px", height: "1080"}}
            className="bg-[url('/trend.png')] bg-contain bg-center bg-no-repeat text-black"
            >
            </div>
        </div>
    );
}

export default page;