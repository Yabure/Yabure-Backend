const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})
const  _ = require("lodash");


const Comments = {
    async findByExplanationId(id) {
        let result = await prisma.comments.findMany({ 
            where: { explanationsId: id },
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
            result = result.map(res => {
               return  {
                    ...res,
                    user: {
                        id: res.user.id,
                        profile: {
                            ...res.user.profile,
                            picture: res.user.profile.picture !== "null" ? 
                            `${process.env.AWS_S3_BUCKET_URL}/profile/${res.user.profile.picture}` : "stuff" 
                        }
                    }
                }
                
            })
            return result;
        }
        
        return [];
    },


    async findById(id) {
        const result = await prisma.comments.findFirst({
            where: {
                id
            }
        })

        return result
    },

    async update(id, data){

        const result = await prisma.comments.update({
            where: {
                id
            },
            data: {
                replies: data
            }
        })

        return result
    },

    // async comments

    // async insert(data){
    //     const result = await prisma.explanations.create({data});
    //     return result;
    // },

    async insert(data) {
        await prisma.comments.create({
            data
        })
    }

    // async insert(id, data) {
    //     console.log(id)
    //     const result = await prisma.comments.upsert({
    //       where: { bookId: id },
    //       update: { 
    //           explanations: data.explanations
    //       },
    //       create: {
    //           userId: data.user, 
    //           bookId: id,
    //           explanations: data.explanations 
    //       },
    //     })
    //     return result
    //   },


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

module.exports = Comments