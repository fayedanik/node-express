
const express = require("express");
const Book = require("../../models/book.model");
const router = express.Router();

router.get("/getBookList",async (req,res) => {
    try {
        console.log(req.query);
        const pageSize = Number(req.query.pageSize) ?? 5;
        const pageNumber = Number(req.query.pageNumber) ?? 1;
        console.log(pageSize);
        //1 * 2 = 2
        //2 * 2 = 4 // will skip first four data
        let results = await Book.find().select({__v:0,likes:0}).skip((pageNumber - 1)*pageSize).limit(pageSize);
        console.log(results);
        return res.status(200).json({
            success: true,
            data: results.map(item => {
                return {
                    Title: item.title,
                    Description: item.description,
                    ItemId: item._id.toString(),
                    Likes: item.likes || 0,
                    Reviews: item.reviews
                }
            })
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
});

router.post("/addBook",async (req,res) => {
    try {
        //const newBook = new Book(req.body);
        console.log(req.body);
        const newBook = new Book({
            title: req.body.title,
            description: req.body.description
        });
        await newBook.save();
        return res.status(200).json({
            success: true,
            error: null
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err.message || "Something went wrong"
        });
    }
    
});

router.put("/update/:id",async (req,res) => {
    console.log(req.params.id);
    const filter = {
        _id: req.params.id
    };
    const update = {
        description: "This is modified description"
    }
    try {
        const response = await Book.findOneAndUpdate(filter,update);
        if( response ) {
            return res.status(200).json({
                success: true,
                error: null
            })
        } else {
            return res.status(500).json({
                success: false,
                error: err.message || "Something went wrong"
            });   
        }
        
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err.message || "Something went wrong"
        });
    }
});

router.delete("delete/:id",async (req,res) => {
    console.log(req.params.id);
    // Book.findOneAndDelete(filter);
    res.status(200).json({
        success: true,
        message: `Id received for ${req.params.id}`
    })
});

module.exports = router;

// CRUD = Create,Read, Update, Delete