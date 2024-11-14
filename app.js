const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb')

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory (optional, if your EJS files are in a folder named "views")
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));


// Connecting to database
// Create connection url
const url = 'mongodb://localhost:27017';
// pass connection url to mongoclient
const client = new MongoClient(url);

async function main (){
    await client.connect();
    console.log("Connected sucessfully to Mongodb server");

    //creating data base (new or existing)
    db= client.db('Mern');
    collection = db.collection('login')
}

main()


app.get("/",(req,res)=>{
    res.render('pages/login');
})

// Route to handle form submission
app.post("/submit",async(req,res)=>{
    const {username,email,password}=req.body;
    try{
        const newUser = { username, email, password };
        await collection.insertOne(newUser);
        // res.render('pages/home', { username, email });
        res.render('pages/home', { username: newUser.username, email: newUser.email });
    }
    catch (err) {
        res.status(500).send('Internal Server Error');
    }  
})

// Route to render the home page after login
app.get("/home", (req, res) => {
    res.render('pages/home');
});



const port=5000;
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});