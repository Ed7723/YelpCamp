const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methoOverride = require('method-override');
const Joi = require('joi');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const { join } = require('path');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});
const app = express();

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methoOverride(`_method`));
app.engine('ejs',ejsMate);

app.get('/', (req,res)=>{
    res.render('Home')
})

app.get('/campgrounds', catchAsync(async(req,res)=>{
    const allCamps = await Campground.find({});
    res.render('campgrounds/index', {allCamps})
}))

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new');
})

app.post('/campgrounds',catchAsync(async (req,res,next) => {
    //if(!req.body.Campground) throw new ExpressError("Invalid Campground Data",400);
    //Joi is server side validation.
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
        }).required()
    })
    const {error} = campgroundSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    }
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground})
}))

app.get(`/campgrounds/:id/edit`, catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground})
}))

app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.put(`/campgrounds/:id`,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500,message="Sum ting wong"} = err;
    res.status(statusCode).render('error', { err });
})

app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})