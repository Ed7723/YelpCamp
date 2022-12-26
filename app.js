const express = require('express')
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const methoOverride = require('method-override');
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
app.use(express.urlencoded({extended:true}));
app.use(methoOverride(`_method`));

app.get('/', (req,res)=>{
    res.render('Home')
})
app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new');
})
app.post('/campgrounds', async(req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrouds/:id',async(req,res)=>{
    const campgroud = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campgroud})
})

app.get(`/campgrounds/:id/edit`, async(req,res)=>{
    const campgroud = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campgroud})
})

app.get('/campground', async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})

app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})
app.delete('/campgrounds/id',async(req,res)=>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})
app.put(`/campgrounds/:id`,async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground_id}`);
})