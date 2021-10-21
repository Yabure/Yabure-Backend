const validateErrorFormatter = require("../utils/validateErrorFormatter")
const Response = require("../utils/errorResponse");
const bookService = require("../services/book.service");



const bookController = {}

bookController.uploadPdf = async (req, res) => {
    try {
        await bookService.uploadPdf(req)
        Response.SUCCESS({response: res, data: {}, message: "book uploaded successfully"})
    } catch(error) {
        const errors = validateErrorFormatter(error)
		return Response.INVALID_REQUEST({ response: res, errors })
    }
};

bookController.getAllBooks = async (req, res) => {
    try {
        const books = await bookService.getAllBooks()
        Response.SUCCESS({response: res, data: books, message: "Request successfully"})
    } catch(error) {
        const errors = validateErrorFormatter(error)
		return Response.INVALID_REQUEST({ response: res, errors })
    }
};

bookController.getSuggestedBooks = async (req, res) => {
    try {
        // console.log(req)
        const books = await bookService.getSuggestedBooks(req)
        Response.SUCCESS({response: res, data: books, message: "Request successfully"})
    } catch(error) {
        const errors = validateErrorFormatter(error)
		return Response.INVALID_REQUEST({ response: res, errors })
    }
};


bookController.rateBook = async (req, res) => {
    try {
        // console.log(req)
        const books = await bookService.addRatings(req.body)
        Response.SUCCESS({response: res, data: books, message: "Request successfully"})
    } catch(error) {
        const errors = validateErrorFormatter(error)
		return Response.INVALID_REQUEST({ response: res, errors })
    }
};




module.exports = bookController  