var express = require('express');
var router = express.Router();

const {mongodb,dbName,dbUrl} = require('../config/dbConfig')
const {mongoose,usersModel,productModel,billModel,customerModel} = require('../config/dbSchema')
const {hashPassword,hashCompare,createToken,decodeToken,validateToken,adminGaurd} = require('../config/auth')
mongoose.connect(dbUrl)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/products', async(req, res) => {
  try {
    let products = await productModel.find()
    if(products) {
      res.send({
        statusCode : 200 ,
        message : "listed successfully" ,
        products
      })
    }else {
      res.send({
        statusCode : 404 ,
        message : "No products found" 
      })
    }
  }catch(error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
})

router.post('/add-bill' , async(req,res) => {
  try {
    let addBill = await billModel.create(req.body)
    res.send({
      statusCode:200,
      message:"Bill added Successfull!",
    })
  }
  catch(error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
})

router.get('/get-bills',  validateToken,adminGaurd , async(req, res) => {
  try {
    let bills = await billModel.find()
    if(bills) {
      res.send({
        statusCode : 200 ,
        message : "listed successfully" ,
        bills ,

      })
    }else {
      res.send({
        statusCode : 404 ,
        message : "No Bills found" 
      })
    }
  }catch(error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
})

router.get('/get-bill/:email', async(req, res) => {
  try {
    let result = await billModel.find({email:req.params.email})
    if(result) {
      res.send({
        statusCode : 200 ,
        message : "listed successfully" ,
        result ,
      })
    }else {
      res.send({
        statusCode : 404 ,
        message : "No Bills found" 
      })
    }
  }catch(error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
})

router.delete('/delete/:id' ,validateToken,adminGaurd , async(req,res) => {
  console.log(req.params.id)
  try {
    let result = await productModel.deleteOne({_id:mongodb.ObjectId(req.params.id)},{
      headers : {

      }
    })
    if(result) {
      res.send({
        statusCode : 200 ,
        message : "Deleted successfully",
        result
      })
    }else {
      res.send({
        statusCode : 404,
        message : "Product not found"
      })
    }
    
  }catch(err){
    console.log(err)
    res.send({
      statusCode : 500 ,
      message : "Internal Server Error",
    })
  }
})

router.put('/update-quantity/:id', async(req, res, next) => {
  try {
    let resultFind = await productModel.findOne({_id:mongodb.ObjectId(req.params.id)})
    let result = await productModel.updateOne({_id:mongodb.ObjectId(req.params.id)},
    {
      $set : {
        quantity : resultFind.quantity - 1 
      }
    })
    res.send({
       statusCode : 200 ,
       message : "data updated successfully"
    })
  }catch(err) {
    res.send({
       statusCode : 400 ,
       message : err.message 
  })
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
