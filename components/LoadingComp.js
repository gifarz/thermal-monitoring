import React from 'react';
import { Progress, Image } from "@nextui-org/react";

function LoadingComp(props) {
    console.log('props', props.flag)
    return (
        <div className="w-screen h-screen overflow-y-hidden">
            {/* <Progress
                size="sm"
                isIndeterminate
                aria-label="Loading..."
                className="w-screen"
            /> */}
            <div className="w-full h-full flex flex-col justify-center items-center">
                <Image
                    width={80}
                    alt="NextUI hero Image"
                    src="logopertamina.png"
                />
                {
                    props.flag == 'canvas' ?
                    <p className="pt-2">Generate Canvas Size...</p>
                    :
                    props.flag == 'page' ?
                    <p className="pt-2">Processing Page...</p>
                    :
                    props.flag == 'panel' ?
                    <p className="pt-2">Fetching Panel Data...</p>
                    :
                    ''
                }
            </div>
        </div>
    );
}

export default LoadingComp;