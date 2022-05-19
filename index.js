require("dotenv/config");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const multer = require("multer");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const AWS = require("aws-sdk");
const {v4: uuidv4} = require("uuid");
AWS_ID = "AKIAS6IVKYONISNR6LW7";
AWS_SECRET = "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";
AWS_BUCKET_NAME = "filesofstudent";

const s3 = new AWS.S3({
    accessKeyId: AWS_ID,
    secretAccessKey: AWS_SECRET
})

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, "");
    }
})

const upload = multer({storage}).single("image");


mongoose.connect('mongodb://localhost:27017/student', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTION OPEN!!");
    }).catch((err) => {
        console.log("Error!");
        console.log(err);
    })

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
    res.render("main.ejs");
})

app.post("/submitImage", upload, (req, res) => {
    console.log(req.file);
    let myImage = req.file.originalname.split(".");
    const fileType = myImage[myImage.length - 1];

    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: `${uuidv4()}.${fileType}`,
        Body: req.file.buffer
    }
    s3.upload(params, (error, data) => {
        if (error) {
            res.status(500).send(error)
        }
        res.send(data);
    })
})


app.post("/submit", async(req, res) => {
    const name = req.body.name;
    const registerNumber = req.body.registerNumber;
    const rollNumber = req.body.rollNumber;
    const file = req.body.uploadFile;
    const studentDetails = {name, registerNumber, rollNumber};
    const newStudent = new Student(studentDetails);
    await newStudent.save();
    console.log(name);
    console.log(registerNumber);
    console.log(rollNumber);
    console.log(file);
    res.redirect("/");
})

app.listen(3000, () => {
    console.log("Listening on port 3000!");
})