'use server'

import { prismaMatindok } from "@/lib/prisma"

export async function selectHistoryAlarmMatindok(req, res) {

    let gte = req.split('+')[0]
    let lte = req.split('+')[1]

    try {
        // console.log('halo')
        const data = await prismaMatindok.history_alarm_24.findMany({
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

        // console.log('data selectHistoryAlarmMatindok', data)

        return data
        
    } catch (error) {
        console.log('error history_alarm matindok', error)
    }
}