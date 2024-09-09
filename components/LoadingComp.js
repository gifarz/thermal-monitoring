import React from 'react';
import { Progress, Image } from "@nextui-org/react";

function LoadingComp(props) {
    return (
        <div className="w-screen h-screen overflow-y-hidden">
            <Progress
                size="sm"
                isIndeterminate
                aria-label="Loading..."
                className="w-screen"
            />
            <div className="w-full h-5/6 flex flex-col justify-center items-center">
                <Image
                    width={80}
                    alt="NextUI hero Image"
                    src="logopertamina.png"
                />
                <p className="pt-2">Application Loading...</p>
            </div>
        </div>
    );
}

export default LoadingComp;