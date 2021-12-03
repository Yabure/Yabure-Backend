const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({errorFormat: 'minimal'})
const  _ = require("lodash");



const Book = {
    async findAll() {
        let result = await prisma.book.findMany({
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
        });
        if(result) {
            result = result.map(res => {
                res.book = `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/books/${res.bookNumber}`
                return  _.pick(res, ['id', 'author', 'bookName', 'book', 'rating', 'user',  'createdAt'])
            })
        }

        return result;
    },

    async findByInterest(id, search) {
        if(search) {
            let result = await prisma.book.findMany({
                where: {
                    category: id,
                    bookName: {
                        contains: search
                    }
                },
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
            });
            if(result) {
                result = result.map(res => {
                    res.book = `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/books/${res.bookNumber}`
                    return  _.pick(res, ['id', 'author', 'bookName', 'book', 'rating', 'user',  'createdAt'])
                })
            }
            
            return result
        };

        let result = await prisma.book.findMany({
            where: {
                category: id
            },
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
        });

        if(result) {
            result = result.map(res => {
                res.book = `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/books/${res.bookNumber}`
                return  _.pick(res, ['id', 'author', 'bookName', 'book', 'rating', 'user',  'createdAt'])
            })
        }
        
        return result
    },

    async searchByName(text) {
        let result = await prisma.book.findMany({
            where: {
                bookName: {
                    contains: text,
                }
            },
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
        });
 
        if(result) {
            result = result.map(res => {
                res.book = `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/books/${res.bookNumber}`
                return  _.pick(res, ['id', 'author', 'bookName', 'book', 'rating', 'user',  'createdAt'])
            })
        }

        return result;
    },

    async findAllByAuthor(id) {
        let result = await prisma.book.findMany({
            where: {
                author: id
            },
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
        })

        return result
    },

    async findOne(id) {
        const data = await prisma.book.findUnique({
            where: {
                id
            },
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
        })
        if(data) {
            data.book = `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/books/${data.bookNumber}`
            return  _.pick(data, ['id', 'author', 'bookName', 'book', 'rating', 'user', 'createdAt'])
        }
        return data
    },

    async findOneWithExplanation(id) {
        const data = await prisma.book.findUnique({
            where: {
                id
            },
            include: {
                explanations: {
                    select: {
                        explanations: true
                    }
                }
            }
        })
        if(data) {
            data.book = `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/books/${data.bookNumber}`
            return  _.pick(data, ['id', 'author', 'bookName', 'book', 'rating', 'explanations',  'createdAt'])
        }
        return data
    },

    async findByCategory(category) {
        let result = await prisma.book.findMany({
            where: {
                category 
            },
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        if(result) {
            result = result.map(res => {
                res.book = `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/books/${res.bookNumber}`
                return  _.pick(res, ['id', 'author', 'bookName', 'book', 'rating', 'user',  'createdAt'])
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