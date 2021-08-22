const interests = require("./interestData")

const seedInterest = async (prisma) => {
  for (let interest of interests){
    await prisma.interest.upsert({
        where: {
            field: interest.field,
          },
          update: {
            interests: interest.interest
          },
          create: {
            field: interest.field,
            interests: interest.interest,
          },
    })
  }

}

module.exports = seedInterest
