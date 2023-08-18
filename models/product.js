const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");

const commentSchema = mongoose.Schema({
    text: String,
    username: String,
    date: {
        type: Date,
        default: Date.now
    },
    // user: { type: Schema.Types.ObjectId, ref: "User"}
}, { autoCreate: false});

const productSchema = mongoose.Schema({
    name: String,
    ustbaslik:String,
    aciklama:String,
    description: String,
    imageUrl: String,
    imageUrliki: String,
    imageUrluc: String,
    date: {
        type: Date,
        default: Date.now
    },
    isActive: Boolean,
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    comments: [commentSchema]
});

function validateProduct(product) {
    const schema = new Joi.object({
        name: Joi.string().min(3).max(30).required(),
        ustbaslik: Joi.string().min(3).max(30).required(),
        aciklama: Joi.string().min(3).max(5000).required(),
        description: Joi.string(),
        imageUrl: Joi.string(),
        imageUrliki: Joi.string(),
        imageUrluc: Joi.string(),
        isActive: Joi.boolean(),
        category: Joi.string(),
        comments: Joi.array()
    });

    return schema.validate(product);
}

const Product = mongoose.model("Product", productSchema); 
const Comment = mongoose.model("Comment", commentSchema); 

module.exports = { Product, Comment, validateProduct };