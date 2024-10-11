'use server'

import { prismaDonggi } from "@/lib/prisma"

export async function selectAlarmTagsDonggi(req, res) {
    try {
        let tbtags = []
        let tbalarms = []
        let data = []

        let condition = {
            orderBy: {
                id: 'asc'
            },
        }

        tbalarms = await prismaDonggi.tbalarms.findMany(condition)
        tbtags = await prismaDonggi.tbtags.findMany(condition)

        data = tbalarms.map(alarm => {

            tbtags.forEach(tag => {
                if(alarm.text && alarm.tag === tag.tag){

                    return alarm.text = alarm.text.replace('{desc}', tag.desc)
                }
            })

            return alarm
        })

        return tbalarms
    } catch (error) {
        console.log('error selectAlarmTagsDonggi', error)
    }
}