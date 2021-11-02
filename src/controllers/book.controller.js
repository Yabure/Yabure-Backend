const validateErrorFormatter = require("../utils/validateErrorFormatter")
const Response = require("../utils/errorResponse");
const bookService = require("../services/book.service");



const bookController = {}

bookController.uploadBook = async (req, res) => {
    try {
        await bookService.uploadBook(req)
        Response.SUCCESS({response: res, data: {}, message: "book uploaded successfully"})
    } catch(error) {
        const errors = validateErrorFormatter(error)
		return Response.INVALID_REQUEST({ response: res, errors })
    }
};

bookController.getAllBooks = async (req, res) => {
    if(!req.query.id) {
        try {
            const books = await bookService.getAllBooks()
            Response.SUCCESS({response: res, data: books, message: "Request successfully"})
        } catch(error) {
            const errors = validateErrorFormatter(error)
            return Response.INVALID_REQUEST({ response: res, errors })
        }
    }
    try {
        const book = await bookService.getSingleBook(req.query.id)
        Response.SUCCESS({response: res, data: book, message: "Request successfully"})
    } catch(error) {
        const errors = validateErrorFormatter(error)
        return Response.INVALID_REQUEST({ response: res, errors })
    }
};

bookController.getSuggestedBooks = async (req, res) => {
    try {
        const books = await bookService.getSuggestedBooks(req)
        Response.SUCCESS({response: res, data: books, message: "Request successfully"})
    } catch(error) {
        const errors = validateErrorFormatter(error)
		return Response.INVALID_REQUEST({ response: res, errors })
    }
};


bookController.rateBook = async (req, res) => {
    try {
        const books = await bookService.addRatings(req.body)
        Response.SUCCESS({response: res, data: books, message: "Request successfully"})
    } catch(error) {
        const errors = validateErrorFormatter(error)
		return Response.INVALID_REQUEST({ response: res, errors })
    }
};

bookController.getNewBooks = async (req, res) => {
    try {
        const books = await bookService.getSuggestedBooks(req)
        Response.SUCCESS({response: res, data: books, message: "Request successfully"})
    } catch(error) {
        const errors = validateErrorFormatter(error)
		return Response.INVALID_REQUEST({ response: res, errors })
    }
};

bookController.getReadingBooks = async (req, res) => {
    try{
        const result = await bookService.getReadingBooks(req)
        return Response.SUCCESS({ response: res, data: result, message: "Request Successful" })
    } catch(err) {
       const errors = await validateErrorFormatter(err) 
       return Response.INVALID_REQUEST({ response: res, errors})
    }
}

bookController.addReadingBooks = async (req, res) => {
    try{
        await bookService.addReadingBooks(req)
        return Response.SUCCESS({ response: res, data: {}, message: "Request Successful" })
    } catch(err) {
       const errors = await validateErrorFormatter(err) 
       return Response.INVALID_REQUEST({ response: res, errors})
    }
}

bookController.getFinishedBooks = async (req, res) => {
    try{
        const result = await bookService.getFinishedBooks(req)
        return Response.SUCCESS({ response: res, data: result, message: "Request Successful" })
    } catch(err) {
       const errors = await validateErrorFormatter(err) 
       return Response.INVALID_REQUEST({ response: res, errors})
    }
}


bookController.addFinishedBooks = async (req, res) => {
    try{
        await bookService.addFinishedBooks(req)
        return Response.SUCCESS({ response: res, data: {}, message: "Request Successful" })
    } catch(err) {
       const errors = await validateErrorFormatter(err) 
       return Response.INVALID_REQUEST({ response: res, errors})
    }
}



module.exports = bookController  