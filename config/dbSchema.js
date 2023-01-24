const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name:{type:'string',required:true},
    number:{type:'string',require:true},
    email:{
        type:'string',
        required:true, 
        lowercase:true,
        validate:(value)=>{
            return validator.isEmail(value)
        }
    },
    password:{type:'string',required:true},
    role:{type:'string',default:''},
})

const productSchema = new mongoose.Schema({
    productId:{type:String,required:true},
    productName:{type:String,required:true},
    price:{type:Number,required:true},
    imageUrl:{type:String,default:null},
    quantity:{type:Number,required:true}
})

const billSchema = new mongoose.Schema({
    billId:{type:String,default:Date.now()},
    orderItems:{type:Array,default:[]},
    email:{type:String,required:true},
    orderAmount:{type:Number,required:true},
    purchasedAt:{type:Date,default:Date.now()},
})

let usersModel = mongoose.model('employee-details',userSchema);
let productModel = mongoose.model('product-details',productSchema);
let billModel = mongoose.model('bill-details',billSchema)



module.exports={mongoose,usersModel,productModel,billModel}