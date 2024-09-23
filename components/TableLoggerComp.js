import React from "react";
import {
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DateRangePicker
} from "@nextui-org/react";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { I18nProvider } from "@react-aria/i18n";
import { listTags, headerLogger } from "@/utils/coordinates";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { selectTlgDonggi } from '@/pages/api/selectDonggiData';
import useSWR from 'swr';
import LoadingComp from '@/components/LoadingComp';

export default function TableLoggerComp(props) {
    const [tagValue, setTagValue] = React.useState("L102");

    let headerList = headerLogger.map(header => {
        if (header.includes('T')) {
            return tagValue + '_' + header
        }

        return header
    })

    // console.log('props.isLoading', props.isLoading)
    // console.log('props.isReady', props.isReady)
    // console.log('props.bodyList', props.bodyList)

    const handleSetTag = (e) => {
        setTagValue((prevValue) => { // The way to send realtime value to the parent
            const newValue = e.currentKey
            props.sendTagValue(newValue)
            return newValue
        })
    }

    // Function to convert table data to CSV and trigger a download
    const handleExportToCSV = () => {
        const csvRows = [];

        // Add table headers
        csvRows.push(headerList.join(','));

        // Add table body data
        props.bodyList.forEach(row => {
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
        a.setAttribute('download', 'Data Logger.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="p-0">
            <div className="flex items-center gap-3 mb-4 px-40">
                <Dropdown className="h-full">
                    <DropdownTrigger className="hidden sm:flex">
                        <Button
                            endContent={<ChevronDownIcon className="text-small" />}
                            variant="flat"
                            className="bg-white min-h-full"
                        >
                            {tagValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Table Columns"
                        closeOnSelect={true}
                        selectedKeys={tagValue}
                        selectionMode="single"
                        onSelectionChange={handleSetTag}
                    >
                        {listTags.map((tag, index) => (
                            <DropdownItem key={tag}>
                                {tag}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                <div className="grow flex flex-col gap-4">
                    <I18nProvider locale="id-ID">
                        <DateRangePicker label="Date Range Filter" value={props.date} onChange={props.setDate} />
                    </I18nProvider>
                </div>

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
                            {headerList.map((header) => (
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
                            props.isLoading === false && props.isReady === true ?
                            <>
                                {props.bodyList?.length > 0 ? (
                                    props.bodyList.map((row, rowIndex) => (
                                        <tr
                                            key={row.id}
                                            className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                                        >
                                            {headerList.map((columnKey) => (
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
                                        <td colSpan={headerList.length} className="px-4 py-2 text-sm text-center text-gray-500">
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </>
                            :
                            <tr>
                                <td colSpan={headerList.length} className="px-4 py-2 text-sm text-center text-gray-500">
                                    Preparing Data
                                </td>
                            </tr>
                            
                        }
            
                    </tbody>
                </table>

            </div>
        </div>
    );
}