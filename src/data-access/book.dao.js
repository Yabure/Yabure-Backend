const { PrismaClient } = require("@prisma/client");
const { find } = require("lodash");
const prisma = new PrismaClient({errorFormat: 'minimal'})
const  _ = require("lodash");


const Book = {
    async findAll() {
        let result = await prisma.book.findMany();
        if(result) {
            result = result.map(res => {
                res.book = `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/books/${res.bookNumber}`
                return  _.pick(res, ['id', 'author', 'bookName', 'book', 'rating'])
            })
        }

        return result;
    },

    async findAllByAuthor(id) {
        let result = await prisma.book.findMany({
            where: {
                author: id
            }
        })

        return result
    },

    async findOne(id) {
        const data = await prisma.book.findUnique({
            where: {
                id
            }
        })

        return data
    },

    async findByCategory(category) {
        let result = await prisma.book.findMany({
            where: {
                category 
            }
        });
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
    },

    async updateBookRating(data){
        const result = await prisma.book.updateMany({
            where: {
                id: data.bookId
            },
            data: {
                rating: data.data
            }
        });
        return result;
    },
      
}

module.exports = Book