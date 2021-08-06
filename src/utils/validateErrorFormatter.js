const validateErrorFormatter = (errors) => {
    if(errors.details) {
        const error = {}
        for(const err of errors.details){
            //@ts-ignore
            error[err.context.key] = err.message;
        }
        return error;
    }
    return errors.message
}

module.exports = validateErrorFormatter;