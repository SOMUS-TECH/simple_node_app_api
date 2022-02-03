const mongoose = require('mongoose');
const Product = require('../api/models/product');

exports.products_get_all = (req, res, next) =>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(doc => {
       const response = {
           count: doc.length,
           products: doc.map(doc => {
               return{
                   name:doc.name,
                   price: doc.price,
                   _id: doc._id,
                   productImage: doc.productImage,
                   request:{
                       type: "GET",
                       url: "http://localhost:5000/products/" + doc._id
                   }
               }
           })
       }
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
    
}

exports.create_product = (req, res, next) =>{
     const product = new Product({
         _id: new mongoose.Types.ObjectId(),
         name: req.body.name,
         price: req.body.price,
         productImage: req.file.path
     });
     product.save().then(result =>{
         res.status(200).json({ 
             message: 'Product Created Successfully...',
             product: {
                 name: result.name,
                 price: result.price,
                 productImage: result.productImage,
                 request:{
                     type: "GET",
                     url: "http://localhost:5000/products/" + result._id
                 }
             }
         })
     })
     .catch(err =>{
         console.log(err);
         res.status(500).json({
             error: err
         })
     });
     
 }

 exports.product_details = (req, res, next) =>{
    const id = req.params.productId;
    Product.findById(id)
            .select('name price _id productImage')
            .exec()
            .then(doc => {
                if(doc){
                    res.status(200).json({
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request:{
                            type: "GET",
                            description: "Get all products",
                            url: "http://localhost:5000/products/"
                        }
                    });
                }else{
                    res.status(404).json({
                        message: "No valid entry found"
                    });
                }
                
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });
}



exports.update_product = (req, res, next) =>{
    const id = req.params.productId;
    const updateOps = {}
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product updated Successfully",
            request:{
                type: "GET",
                url: "http://localhost:5000/products/" + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
   
}


exports.delete_product = (req, res, next) =>{
    const id = req.params.productId;
    Product.deleteOne({_id:id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product Deleted Successfully...",
            request:{
                type: "POST",
                url: "http://localhost:5000/products/",
                body:{
                    name: "String",
                    price: "Number"
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
    
}