const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})

const Rating = {
    async findByUserId(id) {
        const result = await prisma.rating.findFirst({ 
            where: { userId: id },
        });
        
        return result;
    },

    async update(data) {
        const result = await prisma.rating.upsert({ 
            where: { userId: data.userId },
            update: {
                [data.field]: {
                    increment: 1
                }
              },
            create: {
                userId: data.userId,
                [data.field]: 1
            },
        });
        
        return result;
    },

    // async findByUserName(username) {
    //     const result = await prisma.profile.findFirst({ 
    //         where: { username },
    //     });
    //     return result;
    //   },
  
    //   async update(data) {
    //     const result = await prisma.profile.update({
    //       where: {
    //         userId: data.userId,
    //       },
    //       data: {
    //         fullName: data.full_name,
    //         username: data.user_name,
    //         phoneNumber: data.phone,
    //       },
    //     });

    //     return result;
    //   },

    //   async addNotes(userId) {
    //     const result = await prisma.profile.update({
    //       where: {
    //         userId
    //       },
    //       data: {
    //         notes: {
    //           increment: 1
    //         }
    //       },
    //     });

    //     return result;
    //   },
  
    //   async updatePicture(userId, data) {
    //     const picture = await prisma.profile.updateMany({
    //       where: {
    //         userId: {
    //           contains: userId,
    //         },
    //       },
    //       data: {
    //         picture: data
    //       },
    //     })

    //     return picture
    //   },
      
}

module.exports = Rating