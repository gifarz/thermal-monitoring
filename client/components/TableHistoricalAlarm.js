import React from "react";
import { headerHistoricalAlarm } from "@/utils/coordinates";

export default function TableHistoricalAlarm(props) {

    let newData

    // Filter props.dataHistoryAlarm with props.selectedGroup (GROUP)
    newData = props.dataHistoryAlarm?.flatMap(data => {

        const stringTimestamp = '20' + data.timestamp
        const year = stringTimestamp.slice(0, 4);
        const month = stringTimestamp.slice(4, 6);
        const day = stringTimestamp.slice(6, 8);
        const hour = stringTimestamp.slice(8, 10);
        const minute = stringTimestamp.slice(10, 12);
        const second = stringTimestamp.slice(12, 14);

        const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

        return props.selectedGroup.replaceAll(' ', '').split(',').flatMap(group => {

            if(data.group == group){

                return props.selectedTag.replaceAll(' ', '').split(',').map(tag => {

                    if(data.tag == tag){
        
                        return {
                            ...data,
                            timestamp: formattedDate
                        }
                    }
                })
            }
        })
    }).filter(item => {
        return item !== undefined
    })

    return (
        <>

            <div className="flex justify-center px-2">
                <table className="min-w-full border-collapse table-auto bg-white shadow-md rounded-md overflow-hidden">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            {headerHistoricalAlarm.map((header) => (
                                <th
                                    key={header}
                                    className="px-2 py-2 text-xs text-gray-700 border-b border-gray-200 text-center"
                                    style={{
                                        fontSize: "12px",
                                    }}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.isLoadingHistoryAlarm ?
                                <tr>
                                    <td colSpan={headerHistoricalAlarm.length} className="px-4 py-2 text-sm text-center text-gray-500"
                                        style={{
                                            fontSize: "12px",
                                        }}
                                    >
                                        Fetching Data
                                    </td>
                                </tr>
                                :
                                <>
                                    {newData?.length > 0 ? (
                                        newData.map((row, rowIndex) => (
                                            <tr
                                                key={row.id}
                                                className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                                            >
                                                {headerHistoricalAlarm.map((columnKey) => (
                                                    <td
                                                        key={columnKey}
                                                        className="px-4 py-2 text-xs text-center text-gray-600 border-b border-gray-200"
                                                        style={{
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {row[columnKey] !== undefined ? row[columnKey].toString() : "N/A"}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={headerHistoricalAlarm.length} className="px-4 py-2 text-sm text-center text-gray-500"
                                                style={{
                                                    fontSize: "12px",
                                                }}
                                            >
                                                No data available
                                            </td>
                                        </tr>
                                    )}
                                </>
                        }

                    </tbody>
                </table>

            </div>
        </>
    );
}