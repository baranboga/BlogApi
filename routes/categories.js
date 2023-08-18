const express = require("express");
const router = express.Router();
const { Category, validateCategory } = require("../models/category");

router.get("/", async (req, res) => {
    const categories = await Category.find().populate("products","name price -_id");
    res.send(categories);
});

router.get("/:id", async (req, res) => {
    const category = await Category.findById(req.params.id);
    if(!category) {
        return res.status(404).send("aradığınız kategori yok.");
    }
    res.send(category);
});

router.post("/", async (req, res) => {
    const { error }= validateCategory(req.body);

    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    const category = new Category({
        name: req.body.name,
        products: req.body.products
    }); 

    const newCategory = await category.save();
    res.send(newCategory);
});

router.put("/:id", async (req, res) => {
    const category = await Category.findById(req.params.id);

    if(!category) {
        return res.status(404).send("aradığınız kategori yok.");
    }

    const { error } = validateCategory(req.body);

    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    category.name = req.body.name;

    const updatedCategory = await category.save();
    res.send(updatedCategory);
});


router.delete("/:id", async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if(!category) {
        return res.status(400).send(error.details[0].message); 
    }
    res.send(category);
});

module.exports = router;