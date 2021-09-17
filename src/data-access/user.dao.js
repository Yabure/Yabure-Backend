const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})

const User = {
    async findByEmail(email) {
        const result = await prisma.user.findUnique({ where: { email }});
        return result;
    },

    async findById(id) {
        const result = await prisma.user.findUnique({ where: { id }});
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
        const result = await prisma.user.create({
          data: {
            email: data.email,
            password: data.password,
            profile: {
              create: {
                fullName: `${data.firstName} ${data.lastName}`,
                username: `${data.firstName.toLowerCase()}${data.lastName.toLowerCase()}_yabure${Math.floor(Math.random() * 10001) + 1}`,
                phoneNumber: `${data.phoneNumber}`  
              }
            }
          }
        });
        // if (result) return true;
        return result;
      },
  
      async updateUserVerification(email, data) {
        const user = await prisma.user.updateMany({
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

      async updateUserPassword(id, password) {
        const user = await prisma.user.update({
          where: {
            id
          },
          data: {
            password
          },
        })

        return user
      },
  
    //   async remove(userData) {
    //     return "Not implemented";
    //   },
      
}

module.exports = User