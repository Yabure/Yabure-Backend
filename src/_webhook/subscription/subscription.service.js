// const Plan = require("../../data-access/plan.dao");
const User = require("../../data-access/user.dao");
const Book = require("../../data-access/book.dao");

const subscriptionWebhook = {
    subscriptionWebhook: async(body) => {
        try {
            const { email } = body.data.customer
            if(body.event === 'charge.success' || body.event === 'subscription.create') {
                const { plan_code } = body.data.plan
                try {
                    if (!body.data.reference) {
                        await User.updateByEmail(email, {
                            subscribed: true,
                            plan_code
                        })
                        return true
                    }
                } catch (error) {
                    console.log(error)
                    return false
                }
            }

            if (body.event === 'charge.success' && body.data.reference) {
                const { reference } = body.data;
                try {
                    const bookTransaction = await Book.getSingleTransaction({ reference })
                    if (bookTransaction.status === 'PENDING') {
                        await Book.updateTransaction({
                            transactionId: bookTransaction.id,
                            status: 'CONFIRMED'
                        });

                        await User.updateBalance(bookTransaction.owner, bookTransaction.amount)
                        await User.addBookToBoughtBooks(bookTransaction.buyer, bookTransaction.bookId)
                    }
                } catch (error) {
                    console.log(error)
                    return false
                }
            }

            await User.updateByEmail(email, {
                subscribed: false,
            })
            return true

        } catch(error) {
            console.log(error)
            return false
        }
    },

    bookPaymentWebhook: async(body) => {
        const { email } = body.data.customer;
        if (body.event === 'charge.success') {
            const { reference } = body.data;
            try {
                const bookTransaction = await Book.getSingleTransaction({ reference })
                await Book.updateTransaction({
                    transactionId: bookTransaction.id,
                    status: 'CONFIRMED'
                });
            } catch {
                console.log(error)
                return false
            }
        }
    }
}

module.exports = subscriptionWebhook
