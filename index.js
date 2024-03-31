

const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./auth/auth");
const bookRoutes = require("./routes/books/book");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Book = require("./models/book.model");
const { error } = require("console");

const app = express();

app.config = {
    port: 3000
};

dotenv.config();

//app.use(express.static('public'));
app.use("/uploads",express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.listen(process.env.PORT,() => {
    console.log(`app is liseting on port ${process.env.PORT}`);
});

// database connection

mongoose.connect("mongodb://localhost:27017/book")
    .then(() => {
        console.log("connected to database");
    })
    .catch(err => {
        console.log("Mongo connection is unsuccessful");
    });

// var connectionToMongoDb = async () => {
//     try {
//         const response = await mongoose.connect("mongodb://localhost:27017/book");
//         if( response ) {
//             console.log("connected to database");
//         }
//     } catch( err ) {
//         console.log("Mongo connection is unsuccessful");
//     }
// }

// connectionToMongoDb();

app.get('/booklist',(req,res)=> {
    let data = "";
    let readable = fs.createReadStream("./db.json",'utf8');
    readable.pipe(res); // readable stream takes one parameter that is writeable stream. here res is writeable stream
    // readable.on("data",(chunk) => {
    //     data += chunk;
    //     res.write(chunk);
    // });
    // readable.on("end",()=> {
    //     readable.close();
    //     res.end();
    // })
    fs.readFile("./db.json",'utf8',(err,data) => {
        if (err) {
            res.status(err.code).json({
                success: false,
                data: null
            });
        }
        try {
            var parsedData = JSON.parse(data);
            res.status(200).json({
                success: true,
                data: parsedData
            })
        } catch(err) {
            res.status(500).json({
                success: false,
                data: null
            })
        } 
    });
});





const UPLOAD_FOLDER = "./uploads/";

var storage = multer.diskStorage({
    destination: (req,file,cb) => {
        if(!fs.existsSync(UPLOAD_FOLDER)) {
            fs.mkdirSync(UPLOAD_FOLDER);
        }
        cb(null,UPLOAD_FOLDER)
    },
    filename: (req,file,cb) => {
        console.log(file);
        // modifiedfileName = temp-01-02-1010101010
        const ext = path.extname(file.originalname);
        const modifiedFileName = file.originalname
            .replace(ext,"")
            .split(" ").join("-") + "-" + Date.now();
        cb(null,modifiedFileName + ext);
    }
});


const upload = multer({
    storage: storage, // disk storage // memory storage
    limits: {
        fileSize: 2000000 // 2MB
    },
    fileFilter: (req,file,cb) => {
        if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            cb(null,true);
        } else {
            cb(new Error("Only jpg, jpeg, png image are allowed to upload"));
        }
    }
});

app.post("/upload",upload.single("avatar"),(req,res) => {
    console.log(req.file);
    res.status(200).json({
        file: req.file.filename,
        message: "File Uploaded"
    })
})

app.post("/register",(req,res) => {
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);
    res.send("Okay got it");
    res.end();
});

app.use("/api/auth",authRoutes); // mount sub app for authentication
app.use("/api/books",bookRoutes); // mount sub app for books

// error handling middleware

app.use((err,req,res,next) => {
    if( err ) {
        res.status(err.status || 500).json({
            success: false,
            error: err.message
        })
    } else {
        next();
    }
});

module.exports = app;
