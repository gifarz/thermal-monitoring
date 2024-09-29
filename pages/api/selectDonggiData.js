'use server'

import prisma from '@/lib/prisma';

export async function selectRealtimeDonggi(req, res) {
    try {
        // console.log('halo')
        const data = await prisma.realtime.findMany({
            orderBy: {
                id: 'asc'
            },
        })

        // console.log('data prisma direct', data)

        return data
    } catch (error) {
        console.log('error', error)
    }
}

export async function selectTlgDonggi(req, res) {
    try {
        // console.log('req tlg', req)
        let tlg = req.split('+')[0]
        let gte = req.split('+')[1]
        let lte = req.split('+')[2]

        let condition = {
            orderBy: {
                timestamp: 'asc'
            },
            where: {
                timestamp: {
                    gte: gte,  // greater than or equal to startDate
                    lte: lte,  // less than or equal to endDate
                },
            },
            take: 20
        }

        const results = await Promise.all(
            tlg.split(',').map(async (tlg) => {

                if (tlg == "L102") {
                    return await prisma.tlg_l102_24.findMany(condition)

                } else if (tlg == "L103") {
                    return await prisma.tlg_l103_24.findMany(condition)

                } else if (tlg == "L104") {
                    return await prisma.tlg_l104_24.findMany(condition)

                } else if (tlg == "L105") {
                    return await prisma.tlg_l105_24.findMany(condition)

                } else if (tlg == "L202") {
                    return await prisma.tlg_l202_24.findMany(condition)

                } else if (tlg == "L203") {
                    return await prisma.tlg_l203_24.findMany(condition)

                } else if (tlg == "L204") {
                    return await prisma.tlg_l204_24.findMany(condition)

                } else if (tlg == "L205") {
                    return await prisma.tlg_l205_24.findMany(condition)

                } else if (tlg == "L209") {
                    return await prisma.tlg_l209_24.findMany(condition)

                } else if (tlg == "L210") {
                    return await prisma.tlg_l210_24.findMany(condition)

                } else if (tlg == "L212") {
                    return await prisma.tlg_l212_24.findMany(condition)

                } else if (tlg == "L213") {
                    return await prisma.tlg_l213_24.findMany(condition)

                } else if (tlg == "L215") {
                    return await prisma.tlg_l215_24.findMany(condition)

                } else if (tlg == "L216") {
                    return await prisma.tlg_l216_24.findMany(condition)

                } else if (tlg == "L217") {
                    return await prisma.tlg_l217_24.findMany(condition)

                } else if (tlg == "L219") {
                    return await prisma.tlg_l219_24.findMany(condition)

                } else if (tlg == "L220") {
                    return await prisma.tlg_l220_24.findMany(condition)

                } else if (tlg == "L221") {
                    return await prisma.tlg_l221_24.findMany(condition)

                } else if (tlg == "L223") {
                    return await prisma.tlg_l223_24.findMany(condition)

                } else if (tlg == "L224") {
                    return await prisma.tlg_l224_24.findMany(condition)
                }

                return []
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

        // console.log('data prisma direct', result)

        return result
    } catch (error) {
        console.log('error', error)
    }
}

export async function selectAlgDonggi(req, res) {
    try {
        let status = req.split('+')[0]
        let condition = {
            orderBy: {
                id: 'asc'
            },
            where: status !== 'All' ? { status: status } : undefined,
            take: 10
        }

        const data = await prisma.alg_2409.findMany(condition)

        // console.log('data prisma direct', data)

        return data
    } catch (error) {
        console.log('error', error)
    }
}