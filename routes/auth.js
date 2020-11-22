const express = require('express');
const router = express.Router();
const Shop = require('../models/shop');
const Profile = require('../models/profile');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const User = require('../models/user');
const cloudinary = require('../handlers/cloudinary');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const auth = require('../middleware/auth');



router.get('/shops/new', auth, async(req, res) => {
  try {
    res.render('new', {currentUser: req.userData});
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
       
        await User.create(req.body,async(err,ans)=>{
          if(err){
            res.json(err)
            console.log(err)
          }
          else{
            res.redirect('/login');
          }
        })
        
      });
    });
  } catch (e){
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
    if (a.length <= 0) {
      res.json({ message: "Incorrect Username" });
    } else {
      const match = await bcrypt.compare(req.body.password, a.password);
      if (match) {
        const token = await jwt.sign(
          {
            email: a.email,
            username: a.username,
            mobile:a.mobile,
            userid:a.id,
            address:a.address
          },
          "apna_bazaar",
          {
           
          }
        );
        res.cookie("token", token);
      
        res.redirect("/");
      } else res.json({ message: "Incorrect Password" });
    }
  } catch (e) {
  
    res.json({ message: "some error occured" });
  }
});


router.get('/:id/edit', auth, async(req, res) => {
  try {
    await Shop.findById(req.params.id, (err, foundShop) => {
      if (err){

      } else {
        res.render('edit', {shop: foundShop, currentUser: req.userData.username});
      }
    });
  } catch (e){
    res.json({message: e});
  }
});
router.post('/:id/edit', async(req, res) => {
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
router.post('/:id', auth, async(req, res) => {
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
router.get('/shops/profile/:id', auth, async(req, res) => {
  try {
    await Profile.find({}, (err, profiles) => {
      if (err)
        console.log('Error!');
      else
        res.render('profile', {currentUser: req.userData});
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
router.get('/shops/:id/editprofile',auth, async(req, res) => {
  try {
    await User.findById(req.params.id, (err, foundUser) => {
      if (err){
        console.log('error!');
      } else {
       
        res.render('editprofile', {user: foundUser, currentUser: req.userData});
      }
    });
  } catch (e) {
    res.json({message: e});
  }
});

router.post('/shops/:id/profile', async(req, res, next) => {
  try {
    console.log(req.body)
    let usr2 = await User.findOne({_id: req.body.id});
    await usr2.updateOne(req.body)
    res.redirect('/');
  } catch (error){
    next(error);
  }
});

router.get('/:id/contact', auth, async(req, res) => {
  try {
    await Shop.findById(req.params.id, async(err, foundShop) => {
      await User.findById(foundShop.user,(err,foundUser)=>{
      if (err){
        console.log('Error');
      } else {
        console.log(foundUser)
        res.render('contact', {user: foundUser, currentUser: req.userData});
      }
    })
    });
  } catch (e) {
    res.json({message: e});
  }
});
router.get('/shops/profile/:id/newpassword', auth, async(req, res) => {
  try {
    res.render('newpassword', {currentUser: req.userData});
  } catch (e) {
    res.json({message: e});
  }
});
router.post('/shops/profile/:id/newpassword', auth, async(req, res) => {
  try {
    res.render('newpassword', {currentUser: req.userData});
  } catch (e) {
    res.json({message: e});
  }
});
router.get('/:id/change', auth, async(req, res) => {
  try {
    await Shop.findById(req.params.id, (err, foundShop) => {
      if (err){
        console.log('Error');
      } else {
        res.render('change', {shop: foundShop, currentUser: req.userData});
      }
    });
  } catch (e) {
    res.json({message: e});
  }
});
router.post('/:id/change', upload.single('shop[image]'), async(req, res) => {
  try {
    
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
  res.clearCookie('token')
  res.redirect('/');
});

router.get('/:id', auth, async(req, res) => {
  try {
    
    await Shop.findById(req.params.id, (err, foundShop) => {
      if (err){
        res.redirect('/');
      } else {
        res.render('show', {shop: foundShop, currentUser: req.userData});
      }
    });
  } catch (e){
    // res.json({message: e});
  }
});
module.exports = router;