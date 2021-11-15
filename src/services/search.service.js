const Book = require("../data-access/book.dao")
const Interest = require("../data-access/interest.dao")
const Profile = require("../data-access/profile.dao")


const searchService = {}

searchService.searchByBook = async (search) => {
    if(!search){
        const result = await Book.findAll()
        return result
    }
    
    const result = await Book.searchByName(search)
    return result
}

searchService.search = async ({search, filter, name}) => {
    if(filter === "interest") {
      const result = await searchService.searchByInterest(name, search)
      return result
    }

    if(filter === "user") {
        const result = await searchService.searchByUser(search)
        return result
    }

   const result = await searchService.searchByBook(search)
   return result
}

searchService.searchByInterest = async (name, search) => {
    if(!name) throw new Error("interest name is required")
    const interest = await Interest.findByCategory(name)
    if(!interest) throw new Error("no such interest")

    const result = await Book.findByInterest(interest.id, search)
    return result
}

searchService.searchByUser = async (search) => {
    const result = await Profile.searchUser(search)
    return result
}

module.exports = searchService