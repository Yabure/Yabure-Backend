const Profile = require("../data-access/profile.dao");
const fileSystem = require("../services/file-system");
const Book = require("../data-access/book.dao");
const Interest = require("../data-access/interest.dao");
const _ = require("lodash");
const UserInterest = require("../data-access/userInterest.dao");
const ratingService = require("./rating.service");
const User = require("../data-access/user.dao");
const Reading = require("../data-access/reading.dao");
const Finished = require("../data-access/finished.dao");
const Explanation = require("../data-access/explanation.dao");
const Comments = require("../data-access/comments.dao");
const New_Comments = require("../data-access/new_coments.das");
const Followers = require("../data-access/followers.dao")
const { v4: uuidv4 } = require("uuid");
const { getUserByKey } = require("../data-access/user.dao");
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient({errorFormat: 'minimal'})

const bookService = {};

bookService.uploadBook = async ({ body, user }) => {
  try {
    if (!body.bookName || !body.bookName.value.trim())
      throw new Error("Book Name is required");
    if (!body || !body.categoryId || !body.categoryId.value.trim())
      throw new Error("CategoryId is required");
    if (!body || !body.cover_photo)
      throw new Error("cover_photo is required")
    if (!body || !body.price)
      throw new Error("price is required")

    const interest = await Interest.findById(body.categoryId.value);
    if (!interest) throw new Error("Category does not exist");

    const bookNumber = await fileSystem.uploadBook(body.book);
    const cover_photo = await fileSystem.uploadCoverPhoto(body.cover_photo);

    const data = {
      author: user.id,
      bookName: body.bookName.value.toLowerCase(),
      bookNumber,
      category: body.categoryId.value,
      cover_photo,
      price: parseFloat(body.price.value),
      discounted_price: parseFloat(body.discounted_price.value) || 0,
      rating: {
        one_star: 0,
        two_star: 0,
        three_star: 0,
        four_star: 0,
        five_star: 0,
        total: 0,
      },
    };

    console.log(data)

    await Book.insert(data);
    await Profile.addNotes(user.id);

    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

bookService.uploadKeyBook = async ({ body, headers, header }) => {
  try {
    if (!body.authKey.value) throw new Error("Invalid Key first");
    if (!body.bookName || !body.bookName.value.trim())
      throw new Error("Book Name is required");

    const user = await getUserByKey(body.authKey.value);
    if (!user) throw new Error("Invalid Key second");

    const bookNumber = await fileSystem.uploadBook(body.book);

    const data = {
      author: user.userId,
      bookName: body.bookName.value.toLowerCase(),
      bookNumber,
      category: body.categoryId.value,
      rating: {
        one_star: 0,
        two_star: 0,
        three_star: 0,
        four_star: 0,
        five_star: 0,
        total: 0,
      },
    };

    await Book.insert(data);
    await Profile.addNotes(user.userId);

    return true;
  } catch (error) {
    throw new Error(error);
  }
};

bookService.getAllBooks = async () => {
  const books = await prisma.book.findMany({
    include: {
      user: {
        select: {
          id: true,
          profile: true
        }
      }
    },
  });
  return books;
};

bookService.getSuggestedBooks = async ({ user }) => {
  const userInterest = await UserInterest.findByUserId(user.id);
  if (!userInterest) {
    const books = await bookService.getAllBooks();
    return books;
  }

  const interest = await Interest.findAll();

  const intArr = [];
  for (let i = 0; i < interest.length; i++) {
    for (let x = 0; x < userInterest.interest.length; x++) {
      if (interest[i].interests.includes(userInterest.interest[x])) {
        intArr.push(interest[i].id);
      }
    }
  }

  const filteredArr = await Array.from(new Set(intArr));

  const suggestedBooks = [];
  for (interestId of filteredArr) {
    const book = await Book.findByCategory(interestId);
    if (book) suggestedBooks.push(...book);
  }

  return suggestedBooks;
};

bookService.addRatings = async ({ bookId, rating }) => {
  if (typeof rating !== "number" || rating > 5 || rating < 1)
    throw new Error(
      "rating must be a number and should be less than or equal to five"
    );
  const ratingArr = [
    "one_star",
    "two_star",
    "three_star",
    "four_star",
    "five_star",
  ];

  const result = await Book.findOne(bookId);

  result.rating[ratingArr[rating - 1]] += 1;
  const total = await ratingService.bookRating(result.rating);

  const data = {
    ...result.rating,
    total: total.rating,
  };

  const response = await Book.updateBookRating({ bookId, data });

  if (response) {
    const authorBooks = await Book.findAllByAuthor(result.author);

    const sumRating = (previousValue, currentValue) => {
      return {
        rating: {
          total:
            Number(previousValue.rating.total) +
            Number(currentValue.rating.total) / 2,
        },
      };
    };

    const avgRating = authorBooks.reduce(sumRating);

    await User.update(result.author, {
      average_rating: Number(avgRating.rating.total.toFixed(1)),
    });
  }

  return;
};

bookService.getSingleBook = async (id) => {
  const result = await prisma.book.findUnique({
    where: {
      id: id,
    },
    include: {
      user: {
        select: {
          id: true,
          profile: true,
        }
      }
    },
  });
  return result;
};

bookService.getReadingBooks = async ({ user }) => {
  const result = await Reading.findByUserId(user.id);
  return result;
};

bookService.updateReadingLastRead = async ({ user, body }) => {
  console.log(body);
  if (
    !body ||
    !body.bookId ||
    !body.last_read ||
    typeof body.last_read !== "string"
  )
    throw new Error("Invalid Data");
  const data = {
    last_read: body.last_read,
  };

  await Reading.update(user.id, body.bookId, data);
  return;
};

bookService.addReadingBooks = async ({ user, body }) => {
  const data = {
    userId: user.id,
    bookId: body.book,
    last_read: "0",
  };

  const result = await Reading.findOne(data);
  if (result) throw new Error("Book already added to your reading list");

  await Reading.insert(data);

  return;
};

bookService.getFinishedBooks = async ({ user }) => {
  const result = await Finished.findByUserId(user.id);
  return result;
};

bookService.addFinishedBooks = async ({ user, body }) => {
  const data = {
    userId: user.id,
    bookId: body.book,
  };

  const result = await Finished.findOne(data);
  if (result) throw new Error("Book already added to your finished list");

  await Finished.insert({
    userId: user.id,
    bookId: body.book,
    last_read: "100%",
  });

  return;
};

bookService.getPopularUploaders = async ({ user }) => {
  const result = await Followers.findAll();
  const sortedByFollowers = result
    .filter(entry => entry.userId !== user.id)
    .sort((a, b) => b.followers.length - a.followers.length)
    .map(entry => ({
      ...entry,
      following: entry.followers.includes(user.id)
    }));
  return sortedByFollowers;
}

bookService.addExplanation = async ({ user, body }) => {
  if (!body || !body.audio) throw new Error("Audio is required");

  const book = await Book.findOne(body.bookId.value);

  if (!book) throw new Error("Book does not exist");
  if (book.author !== user.id)
    throw new Error("You can't add explanations to this book");

  const audio = await fileSystem.uploadAudio(body.audio);

  let data = {
    userId: user.id,
    bookId: book.id,
    explanation: audio,
  };

  await Explanation.insertOne(data);

  return;
};

bookService.addComments = async ({ user, body }) => {
  if (typeof body.comment !== "string")
    throw new Error("Comment must be a string");

  const explanation = await Explanation.findOne(body.explanationsId);
  if (!explanation) throw new Error("Explanation does not exist");

  await Comments.insert({
    userId: user.id,
    explanationsId: body.explanationsId,
    comment: body.comment.trim(),
    replies: [],
  });

  return;
};

bookService.addNewComments = async ({ user, body }) => {
  if (typeof body.comment !== "string")
    throw new Error("Comment must be a string");
  const { userId, username, fullName, picture } = await Profile.findById(
    user.id
  );

  const bookId = body.bookId.trim();
  const comment = body.comment.trim();

  const comments = await New_Comments.findByBookId(bookId);

  if (comments.length < 1) {
    try {
      await New_Comments.insert({
        bookId: bookId,
        comments: [
          {
            id: uuidv4(),
            userId: userId,
            fullName: fullName,
            username: username,
            comment: comment.trim(),
            date: new Date(),
            picture,
            replies: [],
          },
        ],
      });

      return;
    } catch (error) {
      console.log(error);
      throw new Error("Oops! Somthing went wrong!");
    }
  }

  try {
    comments.comments.push({
      id: uuidv4(),
      fullName: fullName,
      username: username,
      userId: userId,
      comment: comment.trim(),
      date: new Date(),
      picture,
      replies: [],
    });
    await New_Comments.update(bookId, {
      comments: comments.comments,
    });
  } catch (error) {
    console.log("error here");
    console.log(error);
    throw new Error("Oops! Somthing went wrong!");
  }

  return true;
};

bookService.getNewComments = async ({ params }) => {
  const result = await New_Comments.findByBookId(params.explanationsId);

  return result;
};

bookService.getExplanations = async ({ params }) => {
  const result = await Explanation.findByBookId(params.bookId);

  return result;
};

bookService.getExplanationsComments = async ({ params }) => {
  const result = await Comments.findByExplanationId(params.explanationsId);

  return result;
};

// bookService.replyComment = async ({body, user}) => {
//   if(!body) throw new Error("Invalid body data")
//   if(!body.commentId) throw new Error("No comment is specfied")
//   if(!body.reply || typeof(body.reply) !== "string") throw new Error("Reply must be a string and should not be empty")

//   const comment = await Comments.findById(body.commentId)
//   if(!comment) throw new Error("Comments does not exist")

//   const {userId, username, fullName, picture} = await Profile.findById(user)

//   comment.replies.push({
//     "userId": userId,
//     "fullName": fullName,
//     "username": username,
//     "picture": picture,
//     "reply": body.reply
//   })

//   await Comments.update(body.commentId, comment.replies)

//   return []
// }

bookService.replyNewComment = async ({ body, user }) => {
  if (!body) throw new Error("Invalid body data");
  if (!body.commentId) throw new Error("No comment is specfied");
  if (!body.reply || typeof body.reply !== "string")
    throw new Error("Reply must be a string and should not be empty");

  const comment = await New_Comments.findByBookId(body.bookId);
  if (!comment) throw new Error("Comments does not exist");

  const { userId, username, fullName } = await Profile.findById(user.id);

  const result = await comment[0].comments.find((comment) => {
    console.log(comment.id);
    if (comment.id === body.commentId) {
      comment.replies.push({
        userId: userId,
        fullName: fullName,
        username: username,
        reply: body.reply,
      });
    }
  });

  await New_Comments.update(body.bookId, { comments: comment[0].comments });

  return true;
};

module.exports = bookService;
