const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({errorFormat: 'minimal'})
const  _ = require("lodash");

const Finished = {
    async findByUserId(id) {
        let result = await prisma.finished_books.findMany({ 
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
                res.book.book = `${process.env.AWS_S3_BUCKET_URL}/books/${res.book.bookNumber}`
                return  _.pick(res.book, ['id', 'author', 'bookName', 'book', 'rating', 'user', 'createdAt'])
            })
        }
        
        return result;
    },


    async findOne ({userId, bookId}){
        const result = await prisma.finished_books.findFirst({
            where: {
                userId,
                bookId,
            }
        })

        return result
    },

    async insert(data) {
        const result = await prisma.finished_books.create({data})
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

module.exports = Finished