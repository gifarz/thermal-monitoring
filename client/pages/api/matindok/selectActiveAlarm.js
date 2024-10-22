'use server'

import { prismaMatindok } from "@/lib/prisma"

export async function selectActiveAlarmMatindok(req, res) {
    try {
        // console.log('halo')
        const data = await prismaMatindok.active_alarm.findMany({
            orderBy: {
                timestamp: 'desc'
            },
        })

        // console.log('data selectActiveAlarmMatindok', data)

        return data
    } catch (error) {
        console.log('error active_alarm matindok', error)
    }
}