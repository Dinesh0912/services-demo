const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Student = require("./models/Student");

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