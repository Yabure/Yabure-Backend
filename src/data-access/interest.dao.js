const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})

const Interest = {
    async findAll() {
        const result = await prisma.interest.findMany();
        return result;
      },

    async findByInterest(interest) {
          const intArr = []
          const result = await prisma.interest.findMany();             
          for (let i = 0; i < result.length; i++) {
            for(let x = 0; x < interest.length; x++) {
              if(result[i].interests.includes(interest[x])) {
                intArr.push(interest[x])
              }
            }
          }
          if(intArr.length < 1) {
            return false
          }
          return intArr;
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
        const result = await prisma.interest.create({data});
        return result;
      },

    //   async update(userData) {
    //     const update = await userModel.update(userData, { where: { user_uuid: userData.user_uuid } });
    //     if (update) return true;
    //     return false;
    //   },
      
    async remove(email) {
        await prisma.interest.deleteMany({
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