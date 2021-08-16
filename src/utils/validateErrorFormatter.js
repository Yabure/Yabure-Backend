const validateErrorFormatter = (errors) => {
    if(errors.details) {
        const error = {}
        for(const err of errors.details){
            error[err.context.key] = err.message;
        }
        return error;
    }
    return errors.message.split(":")[1]
}
 
module.exports = validateErrorFormatter;  