import React from "react";
import {
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DateRangePicker,
    Spinner
} from "@nextui-org/react";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { I18nProvider } from "@react-aria/i18n";
import { donggiGroupTags, matindokGroupTags, listTags, headerLogger, listSites } from "@/utils/coordinates";

export default function TableLoggerComp(props) {
    const [donggiGroupTag, setDonggiGroupTag] = React.useState(new Set(["L102"]));
    const [matindokGroupTag, setMatindokGroupTag] = React.useState(new Set(["L01"]));
    const [tagValue, setTagValue] = React.useState(new Set(["T01"]));
    const [site, setSite] = React.useState("Donggi");

    const selectedGroupTag = React.useMemo(
        () => Array.from(site.toLowerCase() == 'donggi' ? donggiGroupTag : matindokGroupTag).join(", ").replaceAll("_", " "),
        [site.toLowerCase() == 'donggi' ? donggiGroupTag : matindokGroupTag]
    );

    const selectedTag = React.useMemo(
        () => Array.from(tagValue).join(", ").replaceAll("_", " "),
        [tagValue]
    );

    props.sendGroupTagValue(selectedGroupTag)
    props.sendTagValue(selectedTag)
    props.site(site)

    const handleSetSite = (e) => {
        setSite(() => {
            const newSite = e.currentKey
            // props.sendSite(e.currentKey)
            return newSite
        })
    }

    const headerList = headerLogger.flatMap(header => {

        if (header.includes('T')) {
            // Split selectedGroupTag, remove spaces, and map each group
            return selectedGroupTag
                .replaceAll(' ', '')  // Remove spaces
                .split(',')           // Split into array by commas
                .map(group => group + '_' + header);  // Concatenate group and header
        }
        return [header]
    });

    // Filter the array to include 'timestamp' and only the selected T-tags
    const filteredHeaderList = headerList.filter(header => {
        // Always include 'timestamp'
        if (header === 'timestamp') return true;

        // Extract the T-tag (e.g., 'T01') and check if it's in the selectedTags array
        const tag = header.split('_')[1];  // This gets 'T01', 'T02', etc.

        // Only include if the tag is in selectedTags
        return selectedTag.includes(tag);
    });

    // Custom sort function
    const sortedHeaderList = filteredHeaderList.sort((a, b) => {
        // Always keep 'timestamp' at the beginning
        if (a === 'timestamp') return -1;
        if (b === 'timestamp') return 1;

        // Extract 'L' part (e.g., L102) and 'T' part (e.g., T01)
        const [aPrefix, aTag] = a.split('_');  // For 'L102_T01' -> aPrefix = 'L102', aTag = 'T01'
        const [bPrefix, bTag] = b.split('_');  // Same for 'b'

        // Sort by prefix first (L102, L103, etc.)
        if (aPrefix < bPrefix) return -1;
        if (aPrefix > bPrefix) return 1;

        // If prefixes are the same, sort by tag ('T01', 'T02', etc.)
        if (aTag < bTag) return -1;
        if (aTag > bTag) return 1;

        // If both prefix and tag are equal, keep the original order
        return 0;
    });

    // Handle date range change
    const handleDateChange = (newDate) => {
        props.setDate(newDate);
    };

    // Function to convert table data to CSV and trigger a download
    const handleExportToCSV = () => {
        const csvRows = [];

        // Add table headers
        csvRows.push(sortedHeaderList.join(','));

        // Add table body data
        if (props.bodyList?.length > 0) {
            props.bodyList.forEach((row) => {
                // Map each columnKey from sortedHeaderList to get values in the correct order
                const rowValues = sortedHeaderList.map((columnKey) => {
                    // Use the same logic as JSX to handle missing values
                    return row[columnKey] !== undefined ? String(row[columnKey]) : "N/A";
                });
                csvRows.push(rowValues.join(',')); // Add the row to CSV
            });
        }

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
            <div className="flex items-center gap-3 mb-4 px-32">

                <Dropdown
                    className="h-full"
                >
                    <DropdownTrigger className="hidden sm:flex">
                        <Button
                            endContent={<ChevronDownIcon className="text-small" />}
                            variant="flat"
                            className="bg-white min-h-full"
                            style={{
                                fontSize: "14px",
                                maxHeight: "50px"
                            }}
                        >
                            {site}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Table Columns"
                        closeOnSelect={true}
                        selectedKeys={site}
                        selectionMode="single"
                        onSelectionChange={handleSetSite}
                    >
                        {listSites.map((site, index) => (
                            <DropdownItem key={site}>
                                {site}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                <Dropdown>
                    <DropdownTrigger className="hidden sm:flex">
                        <Button
                            endContent={<ChevronDownIcon className="text-small" />}
                            variant="flat"
                            className="bg-white min-h-full"
                        >
                            {
                                selectedGroupTag.split(',').length > 1 ?
                                    selectedGroupTag.split(',').length + ' Groups'
                                    :
                                    selectedGroupTag.split(',')[0]
                            }
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Table Columns"
                        closeOnSelect={false}
                        selectedKeys={
                            site.toLowerCase() == 'donggi' ? donggiGroupTag : matindokGroupTag

                        }
                        selectionMode="multiple"
                        onSelectionChange={
                            site.toLowerCase() == 'donggi' ? setDonggiGroupTag : setMatindokGroupTag
                        }
                        className="max-h-40 overflow-y-auto"
                    >
                        {
                            site.toLowerCase() == 'donggi' ?
                                donggiGroupTags.map((groupTag, index) => (
                                    <DropdownItem key={groupTag}>
                                        {groupTag}
                                    </DropdownItem>
                                ))
                                :
                                matindokGroupTags.map((groupTag, index) => (
                                    <DropdownItem key={groupTag}>
                                        {groupTag}
                                    </DropdownItem>
                                ))
                        }
                    </DropdownMenu>
                </Dropdown>

                <Dropdown>
                    <DropdownTrigger className="hidden sm:flex">
                        <Button
                            endContent={<ChevronDownIcon className="text-small" />}
                            variant="flat"
                            className="bg-white min-h-full"
                        >
                            {
                                selectedTag.split(',').length > 1 ?
                                    selectedTag.split(',').length + ' Tags'
                                    :
                                    selectedTag.split(',')[0]
                            }
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Table Columns"
                        closeOnSelect={false}
                        selectedKeys={tagValue}
                        selectionMode="multiple"
                        onSelectionChange={setTagValue}
                        className="max-h-40 overflow-y-auto"
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
                        <DateRangePicker label="Date Range Filter" value={props.date} onChange={handleDateChange} />
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

            <div className="flex flex-row justify-center">
                <table className="min-w-full border-collapse table-auto bg-white shadow-md rounded-md overflow-hidden">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            {sortedHeaderList.map((header) => (
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
                            props.isLoading === false ?
                                <>
                                    {
                                        props.bodyList?.length > 0 ? (
                                            props.bodyList.map((row, rowIndex) => (
                                                <tr
                                                    key={row.id}
                                                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                                                >
                                                    {sortedHeaderList.map((columnKey) => (
                                                        <td
                                                            key={columnKey}
                                                            className="px-4 py-2 text-xs text-center text-gray-600 border-b border-gray-200"
                                                        >
                                                            {row[columnKey] !== undefined ? row[columnKey] : "N/A"}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={sortedHeaderList.length} className="px-4 py-2 text-sm text-center text-gray-500">
                                                    No data available
                                                </td>
                                            </tr>
                                        )
                                    }
                                </>
                                :
                                <tr>
                                    <td colSpan={sortedHeaderList.length} className="px-4 py-2 text-sm text-center text-gray-500">
                                        Preparing Data
                                    </td>
                                </tr>

                        }

                    </tbody>
                </table>

            </div>

            {/* {
                props.loading ?
                    <Spinner className="flex justify-center mt-2" />
                    :
                    null
            } */}
        </div>
    );
}


