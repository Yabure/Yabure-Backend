const Profile = require("../data-access/profile.dao");
const Account = require("../data-access/account.dao");
const fileSystem = require("../services/file-system");
const User = require("../data-access/user.dao");
const bcryptUtils = require("../utils/bcryptUtils");
const Book = require("../data-access/book.dao");
const Interest = require("../data-access/interest.dao");
const  _ = require("lodash")

const bookService = {}

bookService.uploadPdf = async({body, user}) => {
    if(!body.categoryId.value.trim()) throw new Error("Category is required")

    const interest = await Interest.findById(body.categoryId.value)
    if(!interest) throw new Error("Category does not exist");

    const userAccount = await User.findById(user)
    if(!userAccount) throw new Error("This user doesn't exists");


    const imgName = await fileSystem.uploadPdf(body.book)

    const data = {
        author: user,
        bookName: body.bookName.value.trim() ? body.bookName.value : body.book.filename.split(".")[0],
        bookNumber: imgName,
        category: body.categoryId.value
    }


    await Book.insert(data)


    return true
}

bookService.getAllBooks = async () => {
    const books = await Book.findAll()
    return books
}

module.exports = bookService