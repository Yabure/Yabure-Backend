const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ errorFormat: "minimal" });
const _ = require("lodash");

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
                  },
                },
              },
            },
          },
        },
      },
    });

    if (result.length > 0) {
      result = result.map((res) => {
        res.book.book = `${process.env.AWS_S3_BUCKET_URL}/books/${res.book.bookNumber}`;
        return _.pick(res.book, [
          "id",
          "author",
          "bookName",
          "book",
          "rating",
          "user",
          "createdAt",
        ]);
      });
    }

    return result;
  },

  async findOne({ userId, bookId }) {
    const result = await prisma.reading.findFirst({
      where: {
        userId,
        bookId,
      },
    });

    return result;
  },

  async insert(data) {
    try {
      const result = await prisma.reading.create({ data });
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Oops!! something went wrong");
    }
  },

  async update(userId, data) {
    try {
      const result = await prisma.reading.updateMany({
        where: {
          userId,
        },
        data,
      });
      return result;
    } catch (error) {
      throw new Error("Oops!! something went wrong");
    }
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
};

module.exports = Reading;
