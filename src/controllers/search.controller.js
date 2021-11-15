const validateErrorFormatter = require("../utils/validateErrorFormatter")
const Response = require("../utils/errorResponse")
const searchService = require("../services/search.service")



const searchController = {}


searchController.search = async (req, res) => {
    try{
        const result = await searchService.search(req.query)
		return Response.SUCCESS({ response: res, data: result, message: "Fetched Successfully"})
	} catch(err){
		const errors = validateErrorFormatter(err)
		return Response.INVALID_REQUEST({ response: res, errors     })
	}

}
module.exports = searchController