import { PrismaClient } from '@prisma/client';

let prismaDonggi;
let prismaMatindok;

if (process.env.NODE_ENV === 'production') {

    prismaDonggi = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL_DONGGI
            }
        }
    });

    prismaMatindok = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL_MATINDOK
            }
        }
    });

} else {

    if (!global.prismaDonggi) {
        global.prismaDonggi = new PrismaClient({
            datasources: {
                db: { url: process.env.DATABASE_URL_DONGGI }
            }
        });
    }
    if (!global.prismaMatindok) {
        global.prismaMatindok = new PrismaClient({
            datasources: {
                db: { url: process.env.DATABASE_URL_MATINDOK }
            }
        });
    }
    
    prismaDonggi = global.prismaDonggi;
    prismaMatindok = global.prismaMatindok;
}

export { prismaDonggi, prismaMatindok };