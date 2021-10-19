const Profile = require("../data-access/profile.dao");
const fileSystem = require("../services/file-system");
const Book = require("../data-access/book.dao");
const Interest = require("../data-access/interest.dao");
const  _ = require("lodash");
const UserInterest = require("../data-access/userInterest.dao");

const bookService = {}

bookService.uploadPdf = async({body, user}) => {
    if(!body.categoryId.value.trim()) throw new Error("Category is required")

    const interest = await Interest.findById(body.categoryId.value)
    if(!interest) throw new Error("Category does not exist");


    const imgName = await fileSystem.uploadPdf(body.book)

    const data = {
        author: user,
        bookName: body.bookName.value.trim() ? body.bookName.value : body.book.filename.split(".")[0],
        bookNumber: imgName,
        category: body.categoryId.value
    }


    await Book.insert(data)
    Profile.addNotes(user)
    


    return true
}

bookService.getAllBooks = async () => {
    const books = await Book.findAll()
    return books
}

bookService.getSuggestedBooks = async ({user}) => {
    const userInterest = await UserInterest.findByUserId(user)
    if(!userInterest) {
        const books = await bookService.getAllBooks()
        return books
    }

    const interest = await Interest.findAll()

    const intArr = []            
    for (let i = 0; i < interest.length; i++) {
      for(let x = 0; x < userInterest.interest.length; x++) {
        if(interest[i].interests.includes(userInterest.interest[x])) {
          intArr.push(interest[i].id)
        }
      }
    }   

    const filteredArr = await Array.from(new Set(intArr))

    console.log({filteredArr})

    const suggestedBooks = []
    for(interestId of filteredArr){
        const book = await Book.findByCategory(interestId)
        if(book) suggestedBooks.push(...book)
    }
    

    // return intArr;

    // console.log(userInterest)
    // console.log(intArr)
    return suggestedBooks
}

module.exports = bookService