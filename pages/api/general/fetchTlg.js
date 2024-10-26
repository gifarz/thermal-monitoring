'use server'

import { fetcher } from "@/lib/apiHelper"
import { formattedDate } from "@/utils/convertTimestamp"

export async function fetchTlgDonggi(req, res) {
    try {

        // console.log('req fetchTlg Donggi', req)
        let tlg = req.split('+')[0]
        let gte = req.split('+')[1]
        let lte = req.split('+')[2]

        const formattedgte = formattedDate(gte)
        const formattedlte = formattedDate(lte)

        const timestamp = {
            gte: formattedgte,
            lte: formattedlte
        }

        const results = await Promise.all(
            tlg.split(',').map(async (tlg) => {

                const url = `http://localhost:3003/api/donggi/tlg/${tlg.toLowerCase()}`

                return await fetcher(url, timestamp)
            }))

        // console.log('result fetchTlg Donggi', results)

        // Flatten the results array (in case there are multiple datasets)
        const data = results.flat();

        // Object to store merged results by `id`
        const mergedData = {};

        // Iterate over the array
        data.forEach(item => {
            const { id, timestamp, ...rest } = item; // Destructure `id`, `timestamp`, and other keys

            // If the object with the same `id` exists, merge the keys
            if (mergedData[id]) {
                mergedData[id] = {
                    ...mergedData[id], // Existing data
                    ...rest            // New keys to merge
                };
            } else {
                // If it's the first object with this `id`, add it
                mergedData[id] = {
                    id: id,
                    timestamp: timestamp,
                    ...rest
                };
            }
        });

        // Convert merged data object back to an array
        const result = Object.values(mergedData);

        // console.log('data api direct', result)

        return result
    } catch (error) {
        console.log('error fetchTlg Donggi', error)
    }
}