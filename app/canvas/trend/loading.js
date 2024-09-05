import React from "react";
import { Progress } from "@nextui-org/react";

export default function loading() {
  return (
    <div className="w-screen h-screen">
        <div className="w-full h-full flex justify-center items-center">
            <p>Application Loading...</p>
        </div>
        <Progress
        size="sm"
        isIndeterminate
        aria-label="Loading..."
        className="max-w-md"
        />
    </div>
  );
}
