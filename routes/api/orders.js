const express = require('express');
const router = express.Router();

const checkAuth = require('../../middleware/check-auth');
const OrderController = require("../controller/orders");

router.get('/', checkAuth, OrderController.orders_get_all)

router.post('/',checkAuth, OrderController.create_orders)

router.get('/:orderId',checkAuth, OrderController.order_details)

router.delete('/:orderId',checkAuth, OrderController.delete_orders)


module.exports = router;