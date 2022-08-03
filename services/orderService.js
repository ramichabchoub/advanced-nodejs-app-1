import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';

import {
  getAll,
  getOne,
  deleteOne,
  updateOne,
  createOne,
} from './handlersFactory.js';

import Product from '../models/productModel.js';
import Cart from '../models/cartModel.js';
import Order from '../models/orderModel.js';

// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  Protected/User
export const createCashOrder = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default paymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: 'success', data: order });
});

export const filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'user') req.filterObject = { user: req.user._id };
  next();
});
// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
export const findAllOrders = getAll(Order);

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
export const findSpecificOrder = getOne(Order);

// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: 'success', data: updatedOrder });
});

// @desc    Update order delivered status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager
export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to paid
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: 'success', data: updatedOrder });
});