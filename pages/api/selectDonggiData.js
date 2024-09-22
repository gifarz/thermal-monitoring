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

        console.log('data prisma direct', data)

        return data
    } catch (error) {
        console.log('error', error)
    }
}

export async function selectTlgDonggi(req, res) {
    try {
        let tlg = req.split('+')[0]
        let gte = req.split('+')[1]
        let lte = req.split('+')[2]

        let data = []
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
            take: 10
        }

        if (tlg == "L102") {
            data = await prisma.tlg_l102_24.findMany(condition)

        } else if (tlg == "L103") {
            data = await prisma.tlg_l103_24.findMany(condition)

        } else if (tlg == "L104") {
            data = await prisma.tlg_l104_24.findMany(condition)

        } else if (tlg == "L105") {
            data = await prisma.tlg_l105_24.findMany(condition)
            
        } else if (tlg == "L202") {
            data = await prisma.tlg_l202_24.findMany(condition)
            
        } else if (tlg == "L203") {
            data = await prisma.tlg_l203_24.findMany(condition)
            
        } else if (tlg == "L204") {
            data = await prisma.tlg_l204_24.findMany(condition)
            
        } else if (tlg == "L205") {
            data = await prisma.tlg_l205_24.findMany(condition)
            
        } else if (tlg == "L209") {
            data = await prisma.tlg_l209_24.findMany(condition)
            
        } else if (tlg == "L210") {
            data = await prisma.tlg_l210_24.findMany(condition)
            
        } else if (tlg == "L212") {
            data = await prisma.tlg_l212_24.findMany(condition)
            
        } else if (tlg == "L213") {
            data = await prisma.tlg_l213_24.findMany(condition)
            
        } else if (tlg == "L215") {
            data = await prisma.tlg_l215_24.findMany(condition)
            
        } else if (tlg == "L216") {
            data = await prisma.tlg_l216_24.findMany(condition)
            
        } else if (tlg == "L217") {
            data = await prisma.tlg_l217_24.findMany(condition)
            
        } else if (tlg == "L219") {
            data = await prisma.tlg_l219_24.findMany(condition)
            
        } else if (tlg == "L220") {
            data = await prisma.tlg_l220_24.findMany(condition)
            
        } else if (tlg == "L221") {
            data = await prisma.tlg_l221_24.findMany(condition)
            
        } else if (tlg == "L223") {
            data = await prisma.tlg_l223_24.findMany(condition)
            
        } else if (tlg == "L224") {
            data = await prisma.tlg_l224_24.findMany(condition)
        }

        // console.log('data prisma direct', data)

        return data
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
