require("../db/mongoose")
const express = require('express');
const router = express.Router();
const Shop = require('../models/shop');
const auth = require("../middleware/auth");
router.get('/book',auth, async(req, res) => {
  try {
    await Shop.find({}, (err, shops) => {
      if (err)
        console.log('Error!');
      else
        res.render('book', {shops: shops, currentUser: req.userData});
    });
  } catch (e) {
    res.json({message: e});
  }
});
router.get('/other', auth,async(req, res) => {
  try {
    await Shop.find({}, (err, shops) => {
      if (err)
        console.log('Error!');
      else {
        res.render('other', {shops: shops, currentUser: req.userData});
      }
    });
  } catch (e) {
    res.json({message: e});
  }
});
router.get('/sport',auth, async(req, res) => {
  try {
    await Shop.find({}, (err, shops) => {
      if (err)
        console.log('Error!');
      else
        res.render('sport', {shops: shops, currentUser: req.userData});
    });
  } catch (e) {
    res.json({message: e});
  }
});
router.get('/mattress', auth,async(req, res) => {
  try {
    await Shop.find({}, (err, shops) => {
      if (err)
        console.log('Error!');
      else
        res.render('mattress', {shops: shops, currentUser: req.userData});
    });
  } catch (e){
    res.json({message: e});
  }
});
router.get('/cycle',auth, async(req, res) => {
  try {
    await Shop.find({}, (err, shops) => {
      if (err)
        console.log('Error!');
      else
        res.render('cycle', {shops: shops, currentUser: req.userData});
    });
  } catch (e) {
    res.json({message: e});
  }
});

module.exports = router;