const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cities = require('./cities')
const Campground = require('../models/campground')
const {places,descriptors} = require('./seedhelpers')
const { default: axios } = require('axios')
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});
const sample = array => array[Math.floor(Math.random()*array.length)];

//This function essentially uses the unsplash API and gets the image link using a GET request
//through axios, in the seedDB function we will call it and get the image url to use.
//client id is the accesskey
async function seedImg(){
    try{
        const resp = await axios.get('https://api.unsplash.com/photos/random',{
            params:{
                client_id: '',
                collections: 483251,
            },
        })
        return resp.data.urls.small
    } catch(err){
        console.error(err)
    }
}

const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i=0;i<10;i++){
        const random1000 =Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*30) + 10;
        const images = await seedImg();
        const camp = new Campground({
            image : images,
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description: "Random description",
            price
        });
        await camp.save();
    };
};

seedDB().then(()=>{
    mongoose.connection.close()
});