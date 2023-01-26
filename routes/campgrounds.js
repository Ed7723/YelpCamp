const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
var multer = require('multer');
var upload = multer({dest:'uploads/'});

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(upload.array('image'),(req,res)=>{
        res.send(req.body,req.file);
    })
    //.post(isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground));

router.get(`/:id/edit`,isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

module.exports = router;