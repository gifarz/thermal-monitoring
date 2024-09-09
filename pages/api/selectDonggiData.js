'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function selectDonggiData(req, res) {
    try {
        // console.log('halo')
        const data = await prisma.realtime.findMany({
            orderBy: {
                id: 'asc'
            }
        })

        console.log('data prisma direct', data)

        return data
    } catch (error) {
        console.log('error', error)
    }
}