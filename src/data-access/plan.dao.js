const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})
const  _ = require("lodash");

const Plan = {
    async findAll() {
        let result = await prisma.plans.findMany();
        result = result.map(res => {
            return  _.pick(res, ['id', 'name', 'view_amount', 'interval'])
        })
        return result
      },

    async findByPlanId(id) {
        let result = await prisma.plans.findFirst({
            where: {
                id
            }
        });
 
        return result
      },

  
      async insert(data) {
        const result = await prisma.token.create({data});
        // if (result) return true;
        return result;
      },

    async remove(email) {
        await prisma.token.deleteMany({
            where: {
                email: {
                contains: email,
                },
            },
        })
        return true
    },
      
}

module.exports = Plan