import React from "react";
import {
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DateRangePicker,
    Select,
    SelectItem
} from "@nextui-org/react";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { I18nProvider } from "@react-aria/i18n";
import { listGroupTags, listTags, headerHistoricalAlarm, groupAlarm, listSites } from "@/utils/coordinates";
import useSWR from 'swr';

export default function TableHistoricalAlarm(props) {
    const [groupAlarmValue, setGroupAlarmValue] = React.useState(new Set(["Danger"]));
    const [tagValue, setTagValue] = React.useState(new Set(["T01"]));
    const [tagAlarm, setTagAlarm] = React.useState(new Set(["All"]));
    const [site, setSite] = React.useState("Donggi");
    const [dataHistorical, setDataHistorical] = React.useState([])

    const selectedGroupAlarm = React.useMemo(
        () => Array.from(groupAlarmValue).join(", ").replaceAll("_", " "),
        [groupAlarmValue]
    );

    const selectedTag = React.useMemo(
        () => Array.from(tagValue).join(", ").replaceAll("_", " "),
        [tagValue]
    );

    // console.log('props.dataAlg', props.dataAlg)
    // console.log('props.dataHistorical', props.dataHistorical)

    // console.log('dataHistorical', dataHistorical)

    const handleSetSite = (e) => {
        setSite(() => {
            const newSite = e.currentKey
            // props.sendSite(e.currentKey)
            return newSite
        })
    }

    return (
        <>
            <div className="w-full flex justify-between items-center gap-3 mb-4 px-2">
                <div className="flex gap-3">

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
                            disabledKeys={["Matindok"]}
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
                                    selectedGroupAlarm.split(',').length > 1 ?
                                        selectedGroupAlarm.split(',').length + ' Groups'
                                        :
                                        selectedGroupAlarm.split(',')[0]
                                }
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={groupAlarmValue}
                            selectionMode="multiple"
                            onSelectionChange={setGroupAlarmValue}
                            className="max-h-40 overflow-y-auto"
                        >
                            {groupAlarm.map((groupAlarm, index) => (
                                <DropdownItem key={groupAlarm}>
                                    {groupAlarm}
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
                            <DateRangePicker label="Date Range Filter" value={props.date} onChange={props.setDate} />
                        </I18nProvider>
                    </div>

                </div>
            </div>

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
                            props.isLoading ?
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
                                    {props.newHistorical?.length > 0 ? (
                                        props.newHistorical.map((row, rowIndex) => (
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