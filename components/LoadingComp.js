import React from 'react';
import { Image } from "@nextui-org/react";

function LoadingComp(props) {
    console.log('props', props.flag)
    return (
        <div className="w-screen h-screen overflow-hidden">
            <div className="w-full h-full flex flex-col justify-center items-center">
                <Image
                    width={80}
                    alt="NextUI hero Image"
                    src="logopertamina.png"
                />
                {
                    props.flag == 'canvas' ?
                    <p className="pt-2">Processing Image...</p>
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