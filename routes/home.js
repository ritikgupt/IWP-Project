const express = require('express');
const router = express.Router();
const Shop = require('../models/shop');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const cloudinary = require('../handlers/cloudinary');
const auth = require("../middleware/auth");
router.get('/', auth, async(req, res) => {
  try {
    await Shop.find({}, (err, shops) => {
      if (err){
        console.log('Error!');
      } else {
        res.render('home', {shops: shops, currentUser: req.userData});
      }
    });
  } catch (e) {
    res.json({message: e});
  }
});
router.post('/', upload.single('image'), async(req, res) => {
  try {
    await cloudinary.v2.uploader.upload(req.file.path, {overwrite: true}, (err, result) => {
      Shop.create({
        title: req.body.title,
        image: result.secure_url,
        body: req.body.body,
        id: req.body.id,
        username: req.body.username,
        item: req.body.item,
        userid:req.body.userid
      });
    });
    res.redirect('/shops/new');
  } catch (e) {
    console.log(e);
    res.json({message: e});
  }
});
module.exports = router;
