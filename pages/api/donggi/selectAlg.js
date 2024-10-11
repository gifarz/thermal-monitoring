'use server'

import { prismaDonggi } from "@/lib/prisma"

export async function selectAlgDonggi(req, res) {
    try {
        let data = []
        let status = req.split('+')[0]
        let condition = {
            orderBy: {
                id: 'asc'
            },
            where: status !== 'All' ? { status: status } : undefined,
            take: 50
        }

        data = await prismaDonggi.alg_2409.findMany(condition)

        data = data.map(item => {
            // Check if the item has a 'timestamp' key and update it
            if (item.timestamp) {
                // Concatenate the value
                const concatTimestamp = '20' + item.timestamp;

                // Extract parts from the string
                const year = concatTimestamp.slice(0, 4);
                const month = concatTimestamp.slice(4, 6);
                const day = concatTimestamp.slice(6, 8);
                const hours = concatTimestamp.slice(8, 10);
                const minutes = concatTimestamp.slice(10, 12);
                const seconds = concatTimestamp.slice(12, 14);

                item.timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            }

            // Return the updated object
            return item;
        });

        // console.log('data alarm direct', data)

        return data
    } catch (error) {
        console.log('error', error)
    }
}