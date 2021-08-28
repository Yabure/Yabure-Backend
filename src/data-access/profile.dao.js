const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})

const Profile = {
    async findById(id) {
        const result = await prisma.profile.findFirst({ 
            where: { userId: id },
            include: {
                user: {
                  select: {
                    email: true,
                  },
                },
            }
        });
        if(result) {
          result.picture = result.picture !== "null" ? `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/profile/${result.picture}` : null
        }
        return result;
      },

    async findByUserName(username) {
        const result = await prisma.profile.findFirst({ 
            where: { username },
        });
        return result;
      },
  
      async update(data) {
        const result = await prisma.profile.update({
          where: {
            userId: data.userId,
          },
          data: {
            fullName: data.full_name,
            username: data.user_name,
            phoneNumber: data.phone,
          },
        });

        return result;
      },
  
      async updatePicture(userId, data) {
        const picture = await prisma.profile.updateMany({
          where: {
            userId: {
              contains: userId,
            },
          },
          data: {
            picture: data
          },
        })

        return picture
      },
  
    //   async remove(userData) {
    //     return "Not implemented";
    //   },
      
}

module.exports = Profile