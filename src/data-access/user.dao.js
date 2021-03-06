const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})

const User = {
    async findByEmail(email) {
        const result = await prisma.user.findUnique({ where: { email }});
        return result;
    },

    async findPopularUploaders() {
      const result = await prisma.user.findMany({
        take: 20,
        where: {
          average_rating: {
            gt: 3.0,
          }
        },
        select: {
          id: true,
          email: true,
          average_rating: true,
          profile: {
            select: {
              id: true,
              fullName: true,
              username: true,
              picture: true,
              phoneNumber: true,
              notes: true,
              streams: true
            }
          }
        }
      })

      return result
    },

    async findById(id) {
        const result = await prisma.user.findUnique({ where: { id }});
        return result;
    },
  
    async update(id, data) {
      const result = await prisma.user.update({
        where: {
          id,
        },
        data
      })
    },

    async insert(data) {
      const result = await prisma.user.create({
        data: {
          email: data.email,
          password: data.password,
          profile: {
            create: {
              fullName: `${data.firstName} ${data.lastName}`,
              username: `${data.firstName.toLowerCase()}_yab${Math.floor(Math.random() * 1001) + 1}`,
              phoneNumber: `${data.phoneNumber}`  
            }
          },
          followers: {
            create: {
              followers: []
            }
          }
        }
      });

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
  

}

module.exports = User