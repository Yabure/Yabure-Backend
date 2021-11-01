const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})

const Followers = {
    async findByUserId(id) {
        const result = await prisma.followers.findFirst({ 
            where: { userId: id },
        });
        
        return result;
    },

    async update(userId, data) {
        console.log(data)
        const result = await prisma.followers.update({ 
            where: { userId },
            data
        });
        
        return result;
    },
      
}

module.exports = Followers