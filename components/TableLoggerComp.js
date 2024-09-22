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
import { listTags, headerLogger } from "@/utils/coordinates";
import { selectAlgDonggi, selectTlgDonggi } from '@/pages/api/selectDonggiData';
import useSWR from 'swr';
import LoadingComp from '@/components/LoadingComp';

export default function TableLoggerComp(props) {
    const [page, setPage] = React.useState(1);
    const [tagValue, setTagValue] = React.useState("L102");
    const [fromDate, setFromDate] = React.useState();
    const [toDate, setToDate] = React.useState();

    const { data, error, isLoading } = useSWR(
        tagValue && fromDate && toDate ? `/api/selectDonggiData` : null,
        () => selectTlgDonggi(tagValue + '+' + fromDate + '+' + toDate),
        { refreshInterval: 1000 }
    );

    const currentDateISO = new Date().toISOString();

    // Add a specific end date or duration (e.g., 7 days after the start date)
    const backDate = new Date();
    backDate.setDate(backDate.getDate() - 1); // Example: past 1 day
    const backDateISO = backDate.toISOString();

    let [date, setDate] = React.useState({
        start: parseAbsoluteToLocal(backDateISO),
        end: parseAbsoluteToLocal(currentDateISO)
    });

    // Helper function to pad single digits with leading zeros
    const padZero = (num) => String(num).padStart(2, '0');

    React.useEffect(() => {
        // Format the date objects into 'yyyy-MM-dd HH:mm:ss' format
        const from = `${date.start.year}-${padZero(date.start.month)}-${padZero(date.start.day)} ` +
            `${padZero(date.start.hour)}:${padZero(date.start.minute)}:${padZero(date.start.second)}`;
    
        const to = `${date.end.year}-${padZero(date.end.month)}-${padZero(date.end.day)} ` +
            `${padZero(date.end.hour)}:${padZero(date.end.minute)}:${padZero(date.end.second)}`;

        // Convert to ISO String and set state
        setFromDate(new Date(`${from}`).toISOString());
        setToDate(new Date(`${to}`).toISOString());

    }, [date]); // This will only trigger when `date` changes

    if (error) return <p>Error when loading page</p>
    // if (isLoading) return <LoadingComp flag={'page'} />
    // if (bodyList) return <LoadingComp flag={'page'} />

    let headerList = headerLogger.map(header => {
        if (header.includes('T')) {
            return tagValue + '_' + header
        }

        return header
    })

    // console.log('headerList', headerList)

    let bodyList = data?.map(item => {
        const dateObject = new Date(item.timestamp);
        const formattedDate = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')} ${dateObject.getHours().toString().padStart(2, '0')}:${dateObject.getMinutes().toString().padStart(2, '0')}:${dateObject.getSeconds().toString().padStart(2, '0')}`;

        return {
            ...item,
            timestamp: formattedDate
        }
    });

    console.log('body list', bodyList)

    const handleSetTag = (e) => {
        setTagValue(e.currentKey)
    }

    // Function to convert table data to CSV and trigger a download
    const handleExportToCSV = () => {
        const csvRows = [];

        // Add table headers
        csvRows.push(headerList.join(','));

        // Add table body data
        bodyList.forEach(row => {
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
                        // selectedKeys={statusFilter}
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
                        <DateRangePicker label="Date Range Filter" value={date} onChange={setDate} />
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
                            isLoading ?
                            <tr>
                                <td colSpan={headerList.length} className="px-4 py-2 text-sm text-center text-gray-500">
                                    Fetching Data
                                </td>
                            </tr>
                            :
                            <>
                                {bodyList?.length > 0 ? (
                                    bodyList.map((row, rowIndex) => (
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
                        }
            
                    </tbody>
                </table>

            </div>
        </div>
    );
}