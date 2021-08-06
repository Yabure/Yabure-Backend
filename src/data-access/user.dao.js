const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})

const User = {
    async findByEmail(email) {
        const result = await prisma.users.findUnique({ where: { email }});
        return result;
      },
  
    //   async findByPhone(phone) {
    //     const result = await userModel.findOne({ where: { phone }, attributes: { exclude: ['id', 'password'] } });
    //     return result;
    //   },
  
    //   async findByUuid(user_uuid) {
    //     const result = await userModel.findOne({ where: { user_uuid }, attributes: { exclude: ['id', 'password'] } });
    //     return result;
    //   },
  
      async insert(data) {
        const result = await prisma.users.create({data});
        // if (result) return true;
        return result;
      },
  
      async updateUserVerification(email, data) {
        const user = await prisma.users.updateMany({
          where: {
            email: {
              contains: email,
            },
          },
          data: {
            isVerified: true
          },
        })

        return user
      },
  
    //   async remove(userData) {
    //     return "Not implemented";
    //   },
      
}

module.exports = User