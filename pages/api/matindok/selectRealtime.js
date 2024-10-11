'use server'

import { prismaMatindok } from "@/lib/prisma"

export async function selectRealtimeMatindok(req, res) {
    try {
        // console.log('halo')
        const data = await prismaMatindok.realtimes.findMany({
            orderBy: {
                id: 'asc'
            },
        })

        // console.log('data prismaMatindok direct', data)

        return data
    } catch (error) {
        console.log('error realtime matindok', error)
    }
}