const validateErrorFormatter = (errors) => {
    if(errors.details) {
        const error = {}
        for(const err of errors.details){
            error[err.context.key] = err.message;
        }
        return error;
    }
    const error = errors.message.split(":")[1] ? errors.message.split(":")[1] : errors.message.split(":")[0] 
    return error
}
 
module.exports = validateErrorFormatter;  