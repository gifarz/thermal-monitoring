import React from "react";
import {
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DateRangePicker
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { listStatus, headerAlarm } from "@/utils/coordinates";
import { selectAlgDonggi } from '@/pages/api/selectDonggiData';
import useSWR from 'swr';
import LoadingComp from '@/components/LoadingComp';

export default function TableAlarmComp(props) {
    const [status, setStatus] = React.useState("Active");

    const { data, error, isLoading } = useSWR(
        status ? `/api/selectDonggiData` : null,
        () => selectAlgDonggi(status),
        { refreshInterval: 1000 }
    );

    if (error) return <p>Error when loading page</p>
    // if (isLoading) return <LoadingComp flag={'page'} />
    // if (data) return <LoadingComp flag={'page'} />

    console.log('body list', data)

    const handleSetStatus = (e) => {
        setStatus(e.currentKey)
    }

    // Function to convert table data to CSV and trigger a download
    const handleExportToCSV = () => {
        const csvRows = [];

        // Add table headers
        csvRows.push(headerAlarm.join(','));

        // Add table body data
        data.forEach(row => {
            const values = Object.values(row).map(value => String(value)); // Convert BigInt to string
            csvRows.push(values.join(','));
        });

        // Create CSV string
        const csvString = csvRows.join('\n');

        // Create a Blob and download the CSV file
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'Data Alarm.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="p-0">
            <div className="flex items-center gap-3 mb-4">
                <Dropdown className="h-full">
                    <DropdownTrigger className="hidden sm:flex">
                        <Button
                            endContent={<ChevronDownIcon className="text-small" />}
                            variant="flat"
                            className="bg-white min-h-full"
                        >
                            {status}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Table Columns"
                        closeOnSelect={true}
                        // selectedKeys={statusFilter}
                        selectionMode="single"
                        onSelectionChange={handleSetStatus}
                    >
                        {listStatus.map((status, index) => (
                            <DropdownItem key={status}>
                                {status}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                <Button
                    variant="flat"
                    className="bg-white min-h-full"
                    onClick={handleExportToCSV}
                >
                    Export to CSV
                </Button>
            </div>

            <div className="flex justify-center">
                <table className="min-w-full border-collapse table-auto bg-white shadow-md rounded-md overflow-hidden">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            {headerAlarm.map((header) => (
                                <th
                                    key={header}
                                    className="px-2 py-2 text-xs text-gray-700 border-b border-gray-200 text-center"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isLoading ?
                            <tr>
                                <td colSpan={headerAlarm.length} className="px-4 py-2 text-sm text-center text-gray-500">
                                    Fetching Data
                                </td>
                            </tr>
                            :
                            <>
                                {data?.length > 0 ? (
                                    data.map((row, rowIndex) => (
                                        <tr
                                            key={row.id}
                                            className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                                        >
                                            {headerAlarm.map((columnKey) => (
                                                <td
                                                    key={columnKey}
                                                    className="px-4 py-2 text-xs text-center text-gray-600 border-b border-gray-200"
                                                >
                                                    {row[columnKey] !== undefined ? row[columnKey].toString() : "N/A"}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={headerAlarm.length} className="px-4 py-2 text-sm text-center text-gray-500">
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </>
                        }
            
                    </tbody>
                </table>

            </div>
        </div>
    );
}