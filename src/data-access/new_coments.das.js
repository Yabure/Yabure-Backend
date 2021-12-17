const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})
const  _ = require("lodash");


const New_Comments = {
    async findByBookId(id) {
        let result = await prisma.new_comments.findMany({ 
            where: { bookId: id },
        });
       
        if(result) {    
            return result;
        }
        
        return [];
    },


    async findById(id) {
        const result = await prisma.new_comments.findFirst({
            where: {
                id
            }
        })

        return result
    },

    async update(id, data){
        console.log(data)
        const result = await prisma.new_comments.update({
            where: {
                bookId: id
            },
            data
        })

        return result
    },

    // async comments

    // async insert(data){
    //     const result = await prisma.explanations.create({data});
    //     return result;
    // },

    async insert(data) {
        console.log(data)
        await prisma.new_comments.create({
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

module.exports = New_Comments