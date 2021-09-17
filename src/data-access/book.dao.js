const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({errorFormat: 'minimal'})
const  _ = require("lodash")

const Book = {
    async findAll() {
        let result = await prisma.book.findMany();
        if(result) {
            result = result.map(res => {
                res.book = `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/books/${res.bookNumber}`
                return  _.pick(res, ['author', 'bookName', 'book'])
            })
        }

        return result;
    },

    async insert(data){
        const result = await prisma.book.create({data});
        return result;
    }
      
}

module.exports = Book