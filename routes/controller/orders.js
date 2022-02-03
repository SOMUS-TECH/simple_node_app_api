const Order = require('../api/models/order');
const Product = require('../api/models/product');

exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(doc => {
        res.status(200).json({
            count: doc.length,
            orders: doc.map(doc => {
                return{
                    _id:doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request:{
                        type: "GET",
                        url: "http://localhost:5000/orders/" + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}


exports.create_orders = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product =>{
        if(!product){
            res.status(400).json({
                message:'Product Not found..'
            })
        }
        const order = new Order({
            quantity: req.body.quantity,
            product: req.body.productId,
        });
        return order.save();
    }).then(result =>{
            res.status(200).json({
                message: "Order Stored",
                createOrder:{
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request:{
                    type: "GET",
                    url: "http://localhost:5000/orders/" + result._id
                }
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}


exports.order_details = (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
        if(!order){
           return res.status(400).json({
                message:'Order Not found..'
            })
        }
        res.status(200).json({
            message: "List of Orders",
            orderDetails:{
                _id: order._id,
                product: order.product,
                quantity: order.quantity
            },
            request:{
                type: "GET",
                url: "http://localhost:5000/orders/"
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            err
        })
    })
    
}


exports.delete_orders = (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({_id:id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Order Deleted Successfully...",
            request:{
                type: "POST",
                url: "http://localhost:5000/orders/",
                body:{
                    productId: "String",
                    quantity: "Number"
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