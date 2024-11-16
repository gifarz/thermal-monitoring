'use server'

import { fetcher } from "@/lib/apiHelper"
import { formattedDate } from "@/utils/convertTimestamp"

export default async function fetchTlgTrending(req, res) {
    try {

        // console.log('req fetchTlgTrending', req.query)

        // let site = req.split('+')[0]
        // let tlg = req.split('+')[1]
        // let gte = req.split('+')[2]
        // let lte = req.split('+')[3]
        // let page = req.split('+')[4]
        // let limit = req.split('+')[5]

        const { site, tlg, gte, lte, page, limit } = req.query

        const formattedgte = formattedDate(gte)
        const formattedlte = formattedDate(lte)

        const queryParams = {
            gte: formattedgte,
            lte: formattedlte,
            page: page,
            limit: limit
        }

        const baseUrl = site.toLowerCase() == "donggi" ? 
        "http://localhost:3003/api/donggi" : "http://localhost:3003/api/matindok"

        // console.log('queryParams', queryParams)

        const results = await Promise.all(
            tlg.split(',').map(async (tlg) => {

                const url = `${baseUrl}/tlg/${tlg.toLowerCase()}`

                return await fetcher(url, queryParams)
            }))

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

        // console.log('data api fetchTlgTrending', result)

        res.status(200).json(result)
    } catch (error) {
        console.log('error fetchTlgTrending', error)
    }
}