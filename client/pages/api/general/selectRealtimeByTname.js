'use server'

import { prismaMatindok, prismaDonggi } from "@/lib/prisma"
import { siteLocalStorage } from "@/utils/siteLocalStorage"

export default async function selectRealtimeGeneralByTname(req, res) {
    try {

        let data = []
        const { tag } = req.query
        const { site } = req.query

        // console.log('tag and site', tag + ' and ' + site)

        if(site === 'matindok'){
            
            data = await prismaMatindok.realtime.findMany({
                where: {
                    tname: tag
                },
            })
        } else if(site === 'donggi'){
            data = await prismaDonggi.realtime.findMany({
                where: {
                    tname: tag
                },
            })
        }

        // console.log(`data ${site} direct`, data)

        // return data
    } catch (error) {
        console.log('error general', error)
    }
}