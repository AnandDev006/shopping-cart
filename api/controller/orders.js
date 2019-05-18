const mongoose = require('mongoose');

const Order = require('../models/order');

module.exports = {
	getOrders: async (req, res, next) => {
		const userId = req.params.userId;
		try {
			const { ordersList, _id } = await Order.findOne({ userId }).select(
				'ordersList _id'
			);
			if (!ordersList) {
				return res.status(200).json({ count: 0, products: [] });
			}

			const response = {
				_id,
				count: ordersList.length,
				products: ordersList.map(product => {
					return {
						productId: product.productId,
						product: product.product,
						quantity: product.quantity,
					};
				}),
			};
			res.status(200).json(response);
		} catch (error) {
			res.status(500).json({ error });
		}
	},

	addOrderItem: async (req, res, next) => {
		const userId = req.params.userId;
		const { orderId, product } = req.value.body;
		let orders = null;
		try {
			if (!orderId) {
				orders = new Order({
					_id: new mongoose.Types.ObjectId(),
					userId,
					ordersList: [],
				});
			} else {
				orders = await Order.findById(orderId);
			}

			orders.ordersList.push({
				productId: product._id,
				product,
				quantity: 1,
			});
			const result = await orders.save();

			res.status(201).json({
				message: 'Added product order successfully',
				ordersList: result.ordersList,
			});
		} catch (error) {
			res.status(500).json({ error });
		}
	},

	editOrderItem: async (req, res, next) => {
		const userId = req.params.userId;
		const { orderId, productId, quantity } = req.value.body;
		try {
			const { ordersList } = await Order.findById(orderId).select('ordersList');

			const index = ordersList.findIndex(
				product => product.productId.toString() === productId
			);

			const updateOps = {};
			updateOps[`ordersList.${index}.quantity`] = quantity;

			const result = await Order.updateOne(
				{ _id: orderId },
				{ $set: updateOps }
			);

			res.status(200).json({
				message: 'Order updated',
				request: {
					type: 'GET',
					url: 'http://localhost:5000/orders/' + userId,
				},
			});
		} catch (error) {
			res.status(500).json({ error });
		}
	},

	deleteOrderItem: async (req, res, next) => {
		const userId = req.params.userId;
		const { orderId, productId } = req.value.body;
		try {
			const removeOps = {};
			removeOps[`ordersList`] = { productId };

			const result = await Order.updateOne(
				{ _id: orderId },
				{ $pull: removeOps }
			);

			res.status(200).json({
				message: 'Order updated',
				request: {
					type: 'GET',
					url: 'http://localhost:5000/orders/' + userId,
				},
			});
		} catch (error) {
			res.status(500).json({ error });
		}
	},
};
