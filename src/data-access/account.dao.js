const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})

const Profile = {
    async findById(id) {
        const result = await prisma.account.findFirst({ 
            where: { userId: id },
        });
       
        return result;
      },

    // async findByUserName(username) {
    //     const result = await prisma.account.findFirst({ 
    //         where: { username },
    //     });
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
  
      async update(data) {
        const result = await prisma.account.upsert({
          where: {
            userId: data.userId,
          },
          update: {
            userId: data.userId,
            accountNumber: data.account_number,
            accountName: data.account_name,
            bank: data.account_bank,
          },
          create: {
            userId: data.userId,
            accountNumber: data.account_number,
            accountName: data.account_name,
            bank: data.account_bank,
          },
        });

        return result;
      },
  
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
  
    //   async remove(userData) {
    //     return "Not implemented";
    //   },
      
}

module.exports = Profile