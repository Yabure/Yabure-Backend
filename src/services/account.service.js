const { default: axios } = require("axios")
const _ = require("lodash")
const Rule = require("../data-access/account.dao")
const banks = require("../datas/bank.data")

const accountService = {}

accountService.verify = async ({account_number, account_bank}) => {
    try {
        let bankCode = ""
        for(bank of banks){
            if(bank.name.toLowerCase() === account_bank.toLowerCase()){
                bankCode = bank.bank_code
            }
        }
        const { data }  = await axios.get(`https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bankCode}`, {
            headers: {
                "Authorization":`Bearer ${process.env.PAYSTACK_KEY}`
            }
        });
        return _.pick(data.data, "account_number", "account_name")
    } catch(err) {
        throw new Error("Unable to verify bank details")
    }
}

accountService.getBanks = async () => {
    let allBanks = banks.map(bank => {
        return bank.name
    });

    return allBanks
}

module.exports = accountService