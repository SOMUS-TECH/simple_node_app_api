const express = require('express');
const path = require('path');
const { urlencoded } = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const productRouter = require('./routes/api/products');
const membersRouter = require('./routes/api/member');
const orderRouter = require('./routes/api/orders');
const userRouter = require('./routes/api/users');


mongoose.connect('mongodb+srv://chisomv9:'+process.env.MONGO_ATLAS_PW+'@node-rest-shop.bkpuv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log("connected to database"))
    .catch((err) => console.log("Unable to reach database, Bad network!!!", err));

const app = express();


app.use(morgan('dev'));


// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if(req.method === 'OPTION'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

//init logger
//app.use(logger);

//static folder
app.use(express.static(path.join(__dirname,'public')));

app.use('/uploads',express.static('uploads'));

//product route
app.use('/products', productRouter);

//order route
app.use('/orders', orderRouter);

//user route
app.use('/user', userRouter);

// members route
app.use('/api/member', membersRouter);


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})


app.use((error,req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Serve started on Port ${PORT}`));