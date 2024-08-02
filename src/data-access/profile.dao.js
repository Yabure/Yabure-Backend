const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ errorFormat: "minimal" });

const Profile = {
  //find by id
  async findById(id) {
    const result = await prisma.profile.findFirst({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            can_upload: true,
            subscribed: true,
            books: {
              select: {
                id: true,
                bookNumber: true,
                bookName: true,
                author: true,
                rating: true,
              },
            },
            followers: {
              select: {
                followers: true,
              },
            },
          },
        },
      },
    });
    if (result) {
      result.user.books = result.user.books.map((res) => {
        return {
          ...res,
          book: `${process.env.AWS_S3_BUCKET_URL}/books/${res.bookNumber}`,
        };
      });

      result.picture =
        result.picture !== "null"
          ? `${process.env.AWS_S3_BUCKET_URL}/profile/${result.picture}`
          : null;
    }
    return result;
  },

  //find by profile id
  async findByProfileId(id) {
    const result = await prisma.profile.findFirst({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    if (result) {
      result.picture =
        result.picture !== "null"
          ? `https://yabure-s3-bucket.s3.us-east-2.amazonaws.com/profile/${result.picture}`
          : null;
    }
    return result;
  },

  //find by user name
  async findByUserName(username) {
    const result = await prisma.profile.findFirst({
      where: { username },
    });
    return result;
  },

  // update
  async update(data) {
    const result = await prisma.profile.update({
      where: {
        userId: data.userId,
      },
      data: {
        fullName: data.full_name,
        username: data.user_name,
        phoneNumber: data.phone,
      },
    });

    return result;
  },

  async updateAny(userId, data) {
    const result = await prisma.profile.update({
      where: { userId },
      data: { ...data }
    })

    return result;
  },

  //search by user
  async searchUser(search) {
    let result = await prisma.profile.findMany({
      where: {
        OR: [
          {
            username: {
              contains: search,
            },
          },
          {
            fullName: {
              contains: search,
            },
          },
        ],
      },
    });
    if (result.length > 0) {
      result = result.map((res) => {
        return {
          ...res,
          picture:
            res.picture !== "null"
              ? `${process.env.AWS_S3_BUCKET_URL}/profile/${res.picture}`
              : null,
        };
      });
    }

    return result;
  },

  //add notes
  async addNotes(userId) {
    const result = await prisma.profile.update({
      where: {
        userId,
      },
      data: {
        notes: {
          increment: 1,
        },
      },
    });

    return result;
  },

  //update picture
  async updatePicture(userId, data) {
    const picture = await prisma.profile.updateMany({
      where: {
        userId: {
          contains: userId,
        },
      },
      data: {
        picture: data,
      },
    });

    return picture;
  },
};

module.exports = Profile;
