var express = require('express');
var router = express.Router();

const {mongodb,dbName,dbUrl} = require('../config/dbConfig')
const {mongoose,usersModel,productModel,billModel,customerModel} = require('../config/dbSchema')
const {hashPassword,hashCompare,createToken,decodeToken,validateToken,adminGaurd} = require('../config/auth')
mongoose.connect(dbUrl)
mongoose.set('strictQuery',true)

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async(req, res)=> {
  try {
    let users = await usersModel.find({email:req.body.email})
    if(users.length > 0)
    {
      res.send({
        statusCode:400,
        message:"User Already Exists"
      })
    }
    else
    {
      let hashedPassword = await hashPassword(req.body.password)
      req.body.password = hashedPassword
      let user = await usersModel.create(req.body)
      res.send({
        statusCode:200,
        message:"User Creation Successfull!",
      })
    }

  } catch (error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
});

router.post('/login', async(req,res)=>{
  try {
    let user = await usersModel.findOne({ email: req.body.email });
    if(user){
      let validatePwd = await hashCompare(req.body.password,user.password)
      if(validatePwd) {
        let token = await createToken({email:user.email,role:user.role})
        res.send({
          statusCode : 200 ,
          message : "Login successful",
          role : user.role ,
          email : user.email ,
          token
        })
      }
      else {
        res.send({
          statusCode : 401,
          message : "Invalid password"  
        })
      }
    }
    else {
      res.send({
        statusCode : 400 ,
        message : "user not found"
      })
    }
  } catch(error){

  }
})

router.post('/add-products', validateToken ,adminGaurd, async(req,res) => {
  try {
    let product = await productModel.find({productId:req.body.productId})
    if(product.length > 0) {
      res.send({
        statusCode : 200 ,
        message : "Product already exists"
      })
    }else{
      let addProduct = await productModel.create(req.body)   
      res.send({
        statusCode:200,
        message:"Product added Successfull!",
      })
      
    }
  }catch(error){
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
})



module.exports = router;
