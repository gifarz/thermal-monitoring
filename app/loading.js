import React from "react";
import { Image } from "@nextui-org/react";

export default function page() {
    return (
        <>
            <div className="w-screen h-screen">
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <Image
                        width={80}
                        alt="NextUI hero Image"
                        src="logopertamina.png"
                    />
                    <p className="mt-2">Application Loading...</p>
                </div>
            </div>
        </>
    );
}
