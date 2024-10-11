'use server'

import { prismaMatindok, prismaDonggi } from "@/lib/prisma"

export async function selectRealtimeGeneral(req, res) {
    try {
        console.log('site', req)

        let data = []
        let site = req

        if(site === 'matindok'){
            
            data = await prismaMatindok.realtime.findMany({
                orderBy: {
                    id: 'asc'
                },
            })
        } else if(site === 'donggi'){
            data = await prismaDonggi.realtime.findMany({
                orderBy: {
                    id: 'asc'
                },
            })
        }

        // console.log(`data ${site} direct`, data)

        return data
    } catch (error) {
        console.log('error general', error)
    }
}