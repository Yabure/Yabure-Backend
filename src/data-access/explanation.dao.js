const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})
const  _ = require("lodash");

const Explanation = {
    async findByBookId(id) {
        let result = await prisma.explanations.findUnique({ 
            where: { bookId: id },
            include: {
                user: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                fullName: true,
                                username: true,
                                picture: true
                            }
                        }
                    }
                }
            }
        });

        if(result) {
            result.explanations = result.explanations !== "null" ? 
                result.explanations.map(res => {
                    return `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/audio/${res}`
                })
            : null
            result.user.profile.picture = result.user.profile.picture !== "null" ? `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/profile/${result.user.profile.picture}` : null
            return result;
        }

        return []
    },


    // async insert(data){
    //     const result = await prisma.explanations.create({data});
    //     return result;
    // },

    async insert(id, data) {
        console.log(id)
        const result = await prisma.explanations.upsert({
          where: { bookId: id },
          update: { 
              explanations: data.explanations
          },
          create: {
              userId: data.user, 
              bookId: id,
              explanations: data.explanations 
          },
        })
        return result
      },


    // async update(data) {
    //     const result = await prisma.rating.upsert({ 
    //         where: { userId: data.userId },
    //         update: {
    //             [data.field]: {
    //                 increment: 1
    //             }
    //           },
    //         create: {
    //             userId: data.userId,
    //             [data.field]: 1
    //         },
    //     });
        
    //     return result;
    // },
      
}

module.exports = Explanation