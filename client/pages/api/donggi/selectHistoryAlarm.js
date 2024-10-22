'use server'

import { prismaDonggi } from "@/lib/prisma"

export async function selectHistoryAlarmDonggi(req, res) {

    let gte = req.split('+')[0]
    let lte = req.split('+')[1]

    try {
        // console.log('halo')
        const data = await prismaDonggi.history_alarm_24.findMany({
            orderBy: {
                timestamp: 'desc'
            },
            where: {
                timestamp: {
                    gte: gte,  // greater than or equal to startDate
                    lte: lte,  // less than or equal to endDate
                },
            },
        })

        // console.log('data selectHistoryAlarmDonggi', data)

        return data
    } catch (error) {
        console.log('error history_alarm donggi', error)
    }
}