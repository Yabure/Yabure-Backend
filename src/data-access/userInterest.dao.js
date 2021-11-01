const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})

const UserInterest = {
    // async findByEmail(email) {
    //     const result = await prisma.user_interest.findUnique({ where: { email }});
    //     return result;
    //   },
  
    //   async findByPhone(phone) {
    //     const result = await userModel.findOne({ where: { phone }, attributes: { exclude: ['id', 'password'] } });
    //     return result;
    //   },
  
    //   async findByUuid(user_uuid) {
    //     const result = await userModel.findOne({ where: { user_uuid }, attributes: { exclude: ['id', 'password'] } });
    //     return result;
    //   },
  
      async insert(user, interest) {
        console.log(user)
        const result = await prisma.user_interest.upsert  ({
          where: { userId: user},
          update: { interest },
          create: {userId: user, interest },
        })
        return result
      },

      async findById(id) {
        const result = await prisma.user_interest.findUnique({where: {id}})
        return result
      },

      async findByUserId(id) {
        const result = await prisma.user_interest.findUnique({where: {userId: id}})
        return result
      }
  
    //   async updateUserVerification(email, data) {
    //     const user = await prisma.user.updateMany({
    //       where: {
    //         email: {
    //           contains: email,
    //         },
    //       },
    //       data: {
    //         isVerified: true
    //       },
    //     })

    //     return user
    //   },
  
    //   async remove(userData) {
    //     return "Not implemented";
    //   },
      
}

module.exports = UserInterest