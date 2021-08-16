const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})

const Interest = {
    async findAll() {
        const result = await prisma.interests.findMany();
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
        const result = await prisma.interests.create({data});
        // if (result) return true;
        return result;
      },
  
    //   async update(userData) {
    //     const update = await userModel.update(userData, { where: { user_uuid: userData.user_uuid } });
    //     if (update) return true;
    //     return false;
    //   },
      
    async remove(email) {
        await prisma.interests.deleteMany({
            where: {
                email: {
                contains: email,
                },
            },
        })
        return true
    },
      
}

module.exports = Interest