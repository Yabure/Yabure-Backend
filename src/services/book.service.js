const Profile = require("../data-access/profile.dao");
const fileSystem = require("../services/file-system");
const Book = require("../data-access/book.dao");
const Interest = require("../data-access/interest.dao");
const  _ = require("lodash");
const UserInterest = require("../data-access/userInterest.dao");
const ratingService = require("./rating.service");
const User = require("../data-access/user.dao");
const Reading = require("../data-access/reading.dao");
const Finished = require("../data-access/finished.dao");
const Explanation = require("../data-access/explanation.dao");
const { bool } = require("joi");
const Comments = require("../data-access/comments.dao");

const bookService = {}

bookService.uploadBook = async({body, user}) => {
    if(!body.bookName || !body.bookName.value.trim()) throw new Error("Book Name is required")
    if(!body || !body.categoryId || !body.categoryId.value.trim()) throw new Error("CategoryId is required")

    const interest = await Interest.findById(body.categoryId.value)
    if(!interest) throw new Error("Category does not exist");

  console.log("e reach here")
    const bookNumber = await fileSystem.uploadBook(body.book)

    const data = {
        author: user,
        bookName: body.bookName.value.toLowerCase(),
        bookNumber,
        category: body.categoryId.value,
        rating: {
          one_star: 0,
          two_star: 0,
          three_star: 0,
          four_star: 0,
          five_star: 0,
          total: 0
        }
    }

    console.log("problem")
    await Book.insert(data)
    console.log("finised saving")
    await Profile.addNotes(user)

    console.log("finised working")

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


    const suggestedBooks = []
    for(interestId of filteredArr){
        const book = await Book.findByCategory(interestId)
        if(book) suggestedBooks.push(...book)
    }
    
    return suggestedBooks
}


bookService.addRatings = async ({bookId, rating}) => {
  if(typeof(rating) !== 'number' || rating > 5 || rating < 1) throw new Error("rating must be a number and should be less than or equal to five")
  const ratingArr = ["one_star", "two_star", "three_star", "four_star", "five_star"]

  const result = await Book.findOne(bookId)

  result.rating[ratingArr[rating - 1]] += 1
  const total = await ratingService.bookRating(result.rating)


  const data = {
    ...result.rating,
    total: total.rating
  }


  const response = await Book.updateBookRating({bookId, data})

  if(response) {
    const authorBooks = await Book.findAllByAuthor(result.author)
  
    const sumRating = (previousValue, currentValue) => {
      return { rating: {total: Number(previousValue.rating.total) + Number(currentValue.rating.total) / 2}}
    }
  
    const avgRating = authorBooks.reduce(sumRating)
  
    
    await User.update(result.author, {average_rating:  Number(avgRating.rating.total.toFixed(1))})
  }



  return
}

bookService.getSingleBook = async (id) => {
  const result = await Book.findOne(id)
  return result
}

bookService.getReadingBooks = async ({user}) => {
    const result = await Reading.findByUserId(user)
    return result
}

bookService.addReadingBooks = async ({user, body}) => {
  const data = {
    userId: user,
    bookId: body.book
  }

  const result = await Reading.findOne(data)
  if(result) throw new Error("Book already added to your reading list")
  

  await Reading.insert(data)

  return
}


bookService.getFinishedBooks = async ({user}) => {
    const result = await Finished.findByUserId(user)
    return result
}

bookService.addFinishedBooks = async ({user, body}) => {
  const data = {
    userId: user,
    bookId: body.book
  }

  const result = await Finished.findOne(data)
  if(result) throw new Error("Book already added to your finished list")

  await Finished.insert({
    userId: user,
    bookId: body.book
  })

  return
}

bookService.addExplanation = async ({user, body}) => {
  console.log(body)
  if(!body || !body.audio) throw new Error("Audio is required")
 
  const book = await Book.findOne(body.bookId.value)

  if(!book) throw new Error("Book does not exist")
  if(book.author !== user) throw new Error("You can't add explanations to this book")


  const audio = await fileSystem.uploadAudio(body.audio)
  console.log(book.id)
  let data = {
    userId: user,
    bookId: book.id,
    explanation: audio
  }



  console.log(await Explanation.insertOne(data))

  return
}

bookService.addComments = async ({user, body}) => {
  if(typeof(body.comment) !== "string") throw new Error("Comment must be a string")

  const explanation = await Explanation.findOne(body.explanationsId)
  if(!explanation) throw new Error("Explanation does not exist")



  await Comments.insert({
    userId: user,
    explanationsId: body.explanationsId,
    comment: body.comment.trim(),
    replies: []
  })

  return
}

bookService.getExplanations = async ({params}) => {
  const result = await Explanation.findByBookId(params.bookId)

  return result
}

bookService.getExplanationsComments = async ({params}) => {
  const result = await Comments.findByExplanationId(params.explanationsId)

  return result
}

bookService.replyComment = async ({body, user}) => {
  if(!body) throw new Error("Invalid body data")
  if(!body.commentId) throw new Error("No comment is specfied")
  if(!body.reply || typeof(body.reply) !== "string") throw new Error("Reply must be a string and should not be empty")


  const comment = await Comments.findById(body.commentId)
  if(!comment) throw new Error("Comments does not exist")
  
  const {userId, username, fullName, picture} = await Profile.findById(user)


  comment.replies.push({
    "userId": userId,
    "fullName": fullName,
    "username": username,
    "picture": picture,
    "reply": body.reply
  })

  await Comments.update(body.commentId, comment.replies)

  return []
}


module.exports = bookService