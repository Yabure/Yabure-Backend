const Book = require("../../data-access/book.dao");
const User = require("../../data-access/user.dao");

const adminDashboardService = {};

adminDashboardService.getDashboardData = async (request, response) => {
  const books = await Book.countAll();
  const users = await User.countAllMod();

  return {
    books,
    users,
  };
};

module.exports = adminDashboardService;
