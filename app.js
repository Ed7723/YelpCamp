const express = require('express')
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));


app.get('/', (req,res)=>{
    res.render('Home')
})

app.get('/campgrouds/:id',async(req,res)=>{
    res.render('campgrounds/show')
})
app.get('/campground', async(req,res)=>{
    const camgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})

app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})