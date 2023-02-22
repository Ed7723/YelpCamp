const mongoose = require('mongoose')
const cities = require('./cities')
const Campground = require('../models/campground')
const {places,descriptors} = require('./seedhelpers')
const { default: axios } = require('axios')
require('dotenv').config();
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});9
const sample = array => array[Math.floor(Math.random()*array.length)];

//This function essentially uses the unsplash API and gets the image link using a GET request
//through axios, in the seedDB function we will call it and get the image url to use.
//client id is the accesskey
async function seedImg(){
    try{
        const resp = await axios.get('https://api.unsplash.com/photos/random',{
            params:{
                client_id: process.env.UNSPLASH_ID,
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
    for(let i=0;i<200;i++){
        const random1000 =Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*30) + 10;
        const images = await seedImg();
        const camp = new Campground({
            author: '63c33e6c7c3a86aea6132180',
            geometry:{
                "type" : "Point" ,
                "coordinates":[
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images : [
                {
                  url: 'https://res.cloudinary.com/dzsvvrwtd/image/upload/v1675283907/YelpCamp/bzwx0anmfmqdianqquak.jpg',
                  filename: 'YelpCamp/bzwx0anmfmqdianqquak',
                },
                {
                  url: 'https://res.cloudinary.com/dzsvvrwtd/image/upload/v1675295354/YelpCamp/x3hzccck7mnzan82mola.jpg',
                  filename: 'YelpCamp/x3hzccck7mnzan82mola',
                }
              ],
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