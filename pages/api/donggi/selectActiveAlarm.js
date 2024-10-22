'use server'

import { prismaDonggi } from "@/lib/prisma"

export async function selectActiveAlarmDonggi(req, res) {
    try {
        // console.log('halo')
        const data = await prismaDonggi.active_alarm.findMany({
            orderBy: {
                timestamp: 'desc'
            },
        })

        // console.log('data selectActiveAlarmDonggi', data)

        return data
    } catch (error) {
        console.log('error active_alarm donggi', error)
    }
}