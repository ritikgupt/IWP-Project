const express = require('express');
const router = express.Router();
const passport = require('passport');
const Shop = require('../models/shop');
const Profile = require('../models/profile');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const User = require('../models/user');
const cloudinary = require('../handlers/cloudinary');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/shops/login');
  }
}

router.get('/shops/new', isLoggedIn, async(req, res) => {
  try {
    console.log(req.user);
    res.render('new', {currentUser: req.user});
  } catch (e){
    res.json({message: e});
  }
});
router.get('/sign', async(req, res) => {
  try {
    res.render('sign');
  } catch (e){
    res.json({message: e});
  }
});
router.post('/sign', async(req, res) => {
  try {
    await bcrypt.genSalt(saltRounds,async (err, salt)=> {
      bcrypt.hash(req.body.password, salt, async (err, hash) =>{
        req.body.password=hash
        await User.create(req.body)
        
      });
    });
    return res.redirect('/login')
    
  } catch (e){
    console.log(e);
    res.json({message: e});
  }
});
router.get('/login', async(req, res) => {
  try {
    res.render('login');
  } catch (e) {
    res.json({message: e});
  }
});
router.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const a = await User.findOne({username:username})
    console.log(a)
    if (a.length <= 0) {
      res.json({ message: "Incorrect Username" });
    } else {
      const match = await bcrypt.compare(req.body.password, a.password);
      if (match) {
        const token = await jwt.sign(
          {
            email: a.email,
            username: a.username,
          },
          "apna_bazaar",
          {
            expiresIn: "1h",
          }
        );
        res.cookie("token", token);
        res.redirect("/");
      } else res.json({ message: "Incorrect Password" });
    }
  } catch (e) {
    console.log(e)
    res.json({ message: "some error occured" });
  }
});


router.get('/:id/edit', isLoggedIn, async(req, res) => {
  try {
    await Shop.findById(req.params.id, (err, foundShop) => {
      if (err){
        console.log('Error');
      } else {
        res.render('edit', {shop: foundShop, currentUser: req.user});
      }
    });
  } catch (e){
    res.json({message: e});
  }
});
router.put('/:id', async(req, res) => {
  try {
    req.body.shop.body = req.sanitize(req.body.shop.body);
    await Shop.findByIdAndUpdate(req.params.id, req.body.shop, (err, updatedShop) => {
      if (err){
        res.redirect('home');
      } else {
        res.redirect('/' + req.params.id);
      }
    });
  } catch (e){
    res.json({message: e});
  }
});
router.delete('/:id', isLoggedIn, async(req, res) => {
  try {
    await Shop.findByIdAndRemove(req.params.id, (err) => {
      if (err){
        res.redirect('/');
      } else {
        res.redirect('/');
      }
    });
  } catch (e){
    res.json({message: e});
  }
});
router.get('/shops/profile/:id', isLoggedIn, async(req, res) => {
  try {
    await Profile.find({}, (err, profiles) => {
      if (err)
        console.log('Error!');
      else
        res.render('profile', {currentUser: req.user});
    // res.redirect("/shops/editprofile/"+ req.user.id)
    });
  } catch (e){
    res.json({message: e});
  }
});

router.get('/shops/redirect', (req, res, next) => {
  try {
    return res.redirect('/shops/editprofile/' + req.user.id);
  } catch (e) {
    res.json({message: e});
  }
});
router.get('/shops/editprofile/:id', async(req, res) => {
  try {
    await User.findById(req.params.id, (err, foundUser) => {
      if (err){
        console.log('error!');
      } else {
        console.log('Found!!!');
        // console.log(foundUser);
        res.render('editprofile', {user: foundUser, currentUser: req.user});
      }
    });
  } catch (e) {
    res.json({message: e});
  }
});

router.post('/shops/profile/:id', async(req, res, next) => {
  try {
    let usr2 = await User.findOne({_id: req.body.id});
    res.render('profile', {currentUser: usr2});
  } catch (error){
    next(error);
  }
});

router.get('/:id/contact', isLoggedIn, async(req, res) => {
  try {
    await Shop.findById(req.params.id, (err, foundShop) => {
      if (err){
        console.log('Error');
      } else {
        res.render('contact', {shop: foundShop, currentUser: req.user});
      }
    });
  } catch (e) {
    res.json({message: e});
  }
});
router.get('/shops/profile/:id/newpassword', isLoggedIn, async(req, res) => {
  try {
    res.render('newpassword', {currentUser: req.user});
  } catch (e) {
    res.json({message: e});
  }
});
router.get('/:id/change', isLoggedIn, async(req, res) => {
  try {
    await Shop.findById(req.params.id, (err, foundShop) => {
      if (err){
        console.log('Error');
      } else {
        res.render('change', {shop: foundShop, currentUser: req.user});
      }
    });
  } catch (e) {
    res.json({message: e});
  }
});
router.put('/:id/change', upload.single('shop[image]'), async(req, res) => {
  try {
    console.log('hello');
    console.log(req.file.path);
    await cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, (err, result) => {
      console.log('Error:', err);
      console.log('Result:', result);
      Shop.findByIdAndUpdate(req.params.id, {image: result.secure_url}, (err, updatedShop) => {
        if (err){
          res.redirect('home');
        } else {
          res.redirect('/' + req.params.id);
        }
      });
    });
  } catch (e) {
    res.json({message: e});
  }
});

router.get('/shops/logout', async(req, res) => {
  await req.logout();
  res.redirect('/');
});

router.get('/:id', isLoggedIn, async(req, res) => {
  try {
    await Shop.findById(req.params.id, (err, foundShop) => {
      if (err){
        res.redirect('/');
      } else {
        res.render('show', {shop: foundShop, currentUser: req.user});
      }
    });
  } catch (e){
    // res.json({message: e});
  }
});
module.exports = router;
