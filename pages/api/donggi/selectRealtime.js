'use server'

import { prismaDonggi } from "@/lib/prisma"

export async function selectRealtimeDonggi(req, res) {
    try {
        // console.log('halo')
        const data = await prismaDonggi.realtime.findMany({
            orderBy: {
                id: 'asc'
            },
        })

        // console.log('data prismaDonggi direct', data)

        return data
    } catch (error) {
        console.log('error realtime donggi', error)
    }
}