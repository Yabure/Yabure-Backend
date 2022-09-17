const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})
const  _ = require("lodash");
const { findOne } = require("./book.dao");

const Explanation = {
    async findByBookId(id) {
        let result = await prisma.explanations.findMany({ 
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

        if(result.length !== 0) {

            result = result.map(res => {
                return {
                    ...res,
                    explanation: `${process.env.AWS_S3_BUCKET_URL}/audio/${res.explanation}`,
                    user: {
                        ...res.user,
                        profile: {
                            ...res.user.profile,
                            picture: `${process.env.AWS_S3_BUCKET_URL}/profile/${res.user.profile.picture}`

                        }
                    }
                }
            })
        }

        return [result]
    },

    async findOne(id) {
        let result = await prisma.explanations.findUnique({
            where: {id}
        })

        return result
    },


    // async insert(data){
    //     const result = await prisma.explanations.create({data});
    //     return result;
    // },

    async insert(id, data) {
        const result = await prisma.explanations.upsert({
          where: { bookId: id },
          update: { 
              explanation: data.explanation
          },
          create: {
              userId: data.user, 
              bookId: id,
              explanation: data.explanation
          },
        })
        return result
      },


    async insertOne(data){
        const result = await prisma.explanations.create({
            data
        })

        console.log(result)

        return result
    }

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