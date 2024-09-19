'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function selectRealtimeDonggi(req, res) {
    try {
        // console.log('halo')
        const data = await prisma.realtime.findMany({
            orderBy: {
                id: 'asc'
            },
        })

        console.log('data prisma direct', data)

        return data
    } catch (error) {
        console.log('error', error)
    }
}

export async function selectAlgDonggi(req, res) {
    try {
        // console.log('halo')
        const data = await prisma.alg_24.findMany({
            orderBy: {
                id: 'asc'
            },
            take: 5
        })

        console.log('data prisma direct', data)

        return data
    } catch (error) {
        console.log('error', error)
    }
}