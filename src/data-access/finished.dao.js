const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({errorFormat: 'minimal'})
const  _ = require("lodash");

const Finished = {
    async findByUserId(id) {
        let result = await prisma.finished_books.findMany({ 
            where: { userId: id },
            include: {
                book: true
            }
        });

        console.log(result)

        if(result.length > 0) {
            result = result.map(res => {
                res.book.book = `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/books/${res.book.bookNumber}`
                return  _.pick(res.book, ['id', 'author', 'bookName', 'book', 'rating'])
            })
        }
        
        return result;
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