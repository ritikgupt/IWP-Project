require("../db/mongoose")
const express=require('express');
const router=express.Router();
const auth = require('../middleware/auth');

const Publishable_Key = process.env.Publishable_Key
const Secret_Key = process.env.Secret_Key
const stripe=require('stripe')(Secret_Key)

router.get('/item/payment',auth,async(req,res)=>{
    console.log(req.userData)
    await res.render('payment',{
        key:Publishable_Key,currentUser: req.userData
    })
})

router.post('/item/payment', auth,function(req, res){ 
  
   console.log(req.userData)
    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({ 
        
        email: req.body.stripeEmail, 
        source: req.body.stripeToken, 
        name: req.userData.username, 
        address: { 
            line1: req.userData.address, 
            postal_code: '302017', 
            city: 'Jaipur', 
            state: 'Rajasthan', 
            country: 'India', 
        } 
    }) 
    .then((customer) => { 
  
        return stripe.charges.create({ 
            amount: 2500,     // Charing Rs 25 
            description: 'Purchased Items', 
            currency: 'INR', 
            customer: customer.id 
        }); 
    }) 
    .then((charge) => { 
        res.send("Success")  // If no error occurs 
    }) 
    .catch((err) => { 
        res.send(err)       // If some error occurs 
    }); 
}) 

module.exports=router;