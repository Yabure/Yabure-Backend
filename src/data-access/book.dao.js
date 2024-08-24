const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ errorFormat: "minimal" });
const _ = require("lodash");

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
              },
            },
          },
        },
      },
    });
    if (result) {
      result = result.map((res) => {
        res.book = `${process.env.AWS_S3_BUCKET_URL}/books/${res.bookNumber}`;
        return _.pick(res, [
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

  async countAll() {
    let result = await prisma.book.count();
    return result;
  },

  async findByInterest(id, search) {
    if (search) {
      let result = await prisma.book.findMany({
        where: {
          category: id,
          bookName: {
            contains: search,
          },
        },
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
      });
      if (result) {
        result = result.map((res) => {
          res.book = `${process.env.AWS_S3_BUCKET_URL}/books/${res.bookNumber}`;
          return _.pick(res, [
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
    }

    let result = await prisma.book.findMany({
      where: {
        category: id,
      },
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
    });

    if (result) {
      result = result.map((res) => {
        res.book = `${process.env.AWS_S3_BUCKET_URL}/books/${res.bookNumber}`;
        return _.pick(res, [
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

  async searchByName(text) {
    let result = await prisma.book.findMany({
      where: {
        bookName: {
          contains: text,
        },
      },
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
    });

    if (result) {
      result = result.map((res) => {
        res.book = `${process.env.AWS_S3_BUCKET_URL}/books/${res.bookNumber}`;
        return _.pick(res, [
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

  async findAllByAuthor(id) {
    let result = await prisma.book.findMany({
      where: {
        author: id,
      },
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
    });

    return result;
  },

  async findByAuthor(id) {
    let result = await prisma.book.findFirst({
        where: {
          author: id,
        },
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
      });

      return result;
  },

  async findOne(id) {
    const data = await prisma.book.findUnique({
      where: {
        id,
      },
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
    });
    if (data) {
      data.book = `${process.env.AWS_S3_BUCKET_URL}/books/${data.bookNumber}`;
      return _.pick(data, [
        "id",
        "author",
        "bookName",
        "price",
        "book",
        "rating",
        "user",
        "createdAt",
      ]);
    }
    return data;
  },

  async findOneWithExplanation(id) {
    const data = await prisma.book.findUnique({
      where: {
        id,
      },
      include: {
        explanations: {
          select: {
            explanations: true,
          },
        },
      },
    });
    if (data) {
      data.book = `${process.env.AWS_S3_BUCKET_URL}/books/${data.bookNumber}`;
      return _.pick(data, [
        "id",
        "author",
        "bookName",
        "book",
        "rating",
        "explanations",
        "createdAt",
      ]);
    }
    return data;
  },

  async findByCategory(category) {
    let result = await prisma.book.findMany({
      where: {
        category,
      },
      include: {
        user: {
          select: {
            id: true,
            isVerified: true,
            profile: {
              select: {
                fullName: true,
                username: true,
                picture: true,
                views: true,
                likes: true,
                dislikes: true,
              },
            },
            followers: {
                select: {
                    followers: true
                }
            }
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (result) {
      result = result.map((res) => {
        res.book = `${process.env.AWS_S3_BUCKET_URL}/books/${res.bookNumber}`;
        return _.pick(res, [
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

  async insert(data) {
    const result = await prisma.book.create({ data });
    return result;
  },

  async createTransaction(data) {
    const result = await prisma.book_transactions.create({ data });
    return result
  },

  async updateTransaction(data) {
    const result = await prisma.book_transactions.updateMany({
        where: { id: data.transactionId },
        data: {
            status: data.status
         }
    })

    result;
  },

  async getAllBookTransactions() {
    const result = await prisma.book_transactions.findMany({
        include: {
            book : {
                select: {
                    bookName: true,
                    price: true,
                    bookNumber: true,
                },
            },
            author: {
                select: {
                    profile: {
                        select: {
                            fullName,
                            username,
                        }
                    }
                }
            },
            buyerUser: {
                select: {
                    profile: {
                        select: {
                            fullName,
                            username,
                        }
                    }
                }
            }
        }
    })
    return result
  },

  async getBookransactionById(data) {
    const result = await prisma.book_transactions.findFirst({
        where: { id: data.id }
    })
  },

  async getSingleTransaction(data) {
    const result = await prisma.book_transactions.findFirst({
        where: { reference: data.reference },
    })
    return result
  },

  async updateBookRating(data) {
    const result = await prisma.book.updateMany({
      where: {
        id: data.bookId,
      },
      data: {
        rating: data.data,
      },
    });
    return result;
  },
};

module.exports = Book;
