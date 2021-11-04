const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})
const  _ = require("lodash");

const Reading = {
    async findByUserId(id) {
        let result = await prisma.reading.findMany({ 
            where: { userId: id },
            include: {
                book: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                profile: {
                                    select: {
                                        fullName: true,
                                        username: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if(result.length > 0) {
            result = result.map(res => {
                res.book.book = `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/books/${res.book.bookNumber}`
                return  _.pick(res.book, ['id', 'author', 'bookName', 'book', 'rating', 'user'])
            })
        }
        
        return result;
    },

    async insert(data){
        const result = await prisma.reading.create({data});
        return result;
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

module.exports = Reading