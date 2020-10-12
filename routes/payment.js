const express=require('express');
const router=express.Router();
const auth = require('../middleware/auth');

const Publishable_Key =
  "pk_test_51HahSYBmc2zn0BuXeA5SzkvM6skCHNWZkO5BRvufpNxoDDrOXJL57R3MRMrkRRt3CrQUEBQboDGONeagKzpwg2cg00ekPZLNJ5";
const Secret_Key =
  "sk_test_51HahSYBmc2zn0BuX3OEB8S2n2uQRvDBjoJDJPPfFXwCZkuiQCjq5ESj2ow3uhOA1PFqrLPd6ioetaaUrkEmPmipP00NpbBkEUg";
const stripe=require('stripe')(Secret_Key)

router.get('/item/payment',auth,async(req,res)=>{
    await res.render('payment',{
        key:Publishable_Key,currentUser: req.userData
    })
})

router.post('/item/payment', auth,function(req, res){ 
  
    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({ 
        email: req.body.stripeEmail, 
        source: req.body.stripeToken, 
        name: 'Ritik Gupta', 
        address: { 
            line1: '3JMC8,Malviya Nagar,Jaipur', 
            postal_code: '302017', 
            city: 'Jaipur', 
            state: 'Rajasthan', 
            country: 'India', 
        } 
    }) 
    .then((customer) => { 
  
        return stripe.charges.create({ 
            amount: 2500,     // Charing Rs 25 
            description: 'Books', 
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