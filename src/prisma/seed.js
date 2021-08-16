const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})

const seedInterest = require("./seed/interest/interest");
const seedRules = require("./seed/rules/rule");

async function main(){
    await seedInterest(prisma)
    await seedRules(prisma)
}

main()
.catch((e) => {
    console.error(e)
    process.exit(1)
})
    .finally(async () => {
    await prisma.$disconnect()
})


