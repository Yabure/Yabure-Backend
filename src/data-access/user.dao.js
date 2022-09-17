const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ errorFormat: "minimal" });

const User = {
  async findByEmail(email) {
    const result = await prisma.user.findUnique({
      where: {
        email: email.toLocaleLowerCase(),
      },
      include: {
        profile: {
          select: {
            fullName: true,
          },
        },
      },
    });
    return result;
  },

  async countAllMod() {
    let result = await prisma.user.count({
      where: {
        role: "MODERATOR",
      },
    });

    return result;
  },
  async getUserByKey(key) {
    let result = await prisma.upload_keys.findUnique({
      where: {
        key,
      },
    });

    return result;
  },

  async countAll(query) {
    console.log(query);
    let result = await prisma.user.count({
      where: {
        AND: query,
      },
    });

    return result;
  },

  async findPopularUploaders() {
    const result = await prisma.user.findMany({
      take: 20,
      where: {
        average_rating: {
          gt: 3.0,
        },
      },
      select: {
        id: true,
        email: true,
        average_rating: true,
        profile: {
          select: {
            id: true,
            fullName: true,
            username: true,
            picture: true,
            phoneNumber: true,
            notes: true,
            streams: true,
          },
        },
      },
    });

    return result;
  },

  async findById(id) {
    const result = await prisma.user.findUnique({ where: { id } });
    return result;
  },

  async update(id, data) {
    const result = await prisma.user.update({
      where: {
        id,
      },
      data,
    });
  },

  async updateByEmail(email, data) {
    const result = await prisma.user.update({
      where: {
        email,
      },
      data,
    });
  },

  async updateByResetId(key, data) {
    const result = await prisma.user.update({
      where: {
        reset: key,
      },
      data,
    });
  },

  async insert(data) {
    const result = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: data.password,
        isVerified: data.isVerified,
        role: data.role,
        subscribed: data.subscribed,
        expire: data.expire,
        profile: {
          create: {
            fullName: `${data.firstName} ${data.lastName}`.toLocaleLowerCase(),
            username: `${data.firstName.toLowerCase()}y${
              Math.floor(Math.random() * 1001) + 1
            }`,
            phoneNumber: `${data.phoneNumber}`,
          },
        },
        followers: {
          create: {
            followers: [],
          },
        },
      },
    });

    return result;
  },

  async updateUserVerification(email, data) {
    const user = await prisma.user.updateMany({
      where: {
        email: {
          contains: email,
        },
      },
      data: {
        isVerified: true,
      },
    });

    return user;
  },

  async updateUserPassword(id, password) {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });

    return user;
  },
};

module.exports = User;
