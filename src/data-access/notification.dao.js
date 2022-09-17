const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ errorFormat: "minimal" });

const Notification = {
  async findById(id) {
    const result = await prisma.notifications.findUnique({ where: { id } });
    if (result) return result;
    return [];
  },

  //   async findByUuid(user_uuid) {
  //     const result = await userModel.findOne({ where: { user_uuid }, attributes: { exclude: ['id', 'password'] } });
  //     return result;
  //   },

  //   async insert(data) {
  //     const result = await prisma.token.create({data});
  //     // if (result) return true;
  //     return result;
  //   },

  //   async update(userData) {
  //     const update = await userModel.update(userData, { where: { user_uuid: userData.user_uuid } });
  //     if (update) return true;
  //     return false;
  //   },

  // async remove(email) {
  //     await prisma.token.deleteMany({
  //         where: {
  //             email: {
  //             contains: email,
  //             },
  //         },
  //     })
  //     return true
  // },
};

module.exports = Notification;
