const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        // Check if there are books linked to this author
        const books = await Book.find({ author: this.id });
        if (books.length > 0) {
            return next(new Error('This author still has books associated with them'));
        }
        next(); // Proceed if no books are found
    } catch (err) {
        next(err); // Handle errors during the check
    }
})

module.exports = mongoose.model('Author', authorSchema)