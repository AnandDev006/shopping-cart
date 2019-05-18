const mongoose = require('mongoose');

const Product = require('../models/product');

module.exports = {
	getAllProducts: async (req, res, next) => {
		try {
			const docs = await Product.find().select('name price _id');
			const response = {
				count: docs.length,
				products: docs.map(doc => {
					return {
						name: doc.name,
						price: doc.price,
						_id: doc._id,
						request: {
							type: 'GET',
							url: 'http://localhost:5000/products/' + doc._id,
						},
					};
				}),
			};
			res.status(200).json(response);
		} catch (error) {
			res.status(500).json({ error });
		}
	},

	addNewProduct: async (req, res, next) => {
		const product = new Product({
			_id: new mongoose.Types.ObjectId(),
			name: req.value.body.name,
			price: req.value.body.price,
		});

		try {
			const result = await product.save();
			res.status(201).json({
				message: 'Created product successfully',
				createdProduct: {
					name: result.name,
					price: result.price,
					_id: result._id,
					request: {
						type: 'GET',
						url: 'http://localhost:5000/products/' + result._id,
					},
				},
			});
		} catch (error) {
			res.status(500).json({ error });
		}
	},

	getProductDetails: async (req, res, next) => {
		const id = req.params.productId;
		try {
			const product = await Product.findById(id).select('name price _id');

			if (product) {
				res.status(200).json({
					product,
					request: {
						type: 'GET',
						url: 'http://localhost:5000/products',
					},
				});
			} else {
				res.status(404).json({ msg: 'No valid entry found for provided ID' });
			}
		} catch (error) {
			res.status(500).json({ error });
		}
	},

	editProductDetails: async (req, res, next) => {
		const id = req.params.productId;
		const updateOps = {};
		try {
			for (const keys in req.value.body) {
				updateOps[keys] = req.value.body[keys];
			}

			await Product.updateOne({ _id: id }, { $set: updateOps });

			res.status(200).json({
				message: 'Product updated',
				request: {
					type: 'GET',
					url: 'http://localhost:5000/products/' + id,
				},
			});
		} catch (error) {
			res.status(500).json({ error });
		}
	},

	deleteProduct: async (req, res, next) => {
		try {
			const id = req.params.productId;
			await Product.remove({ _id: id });

			res.status(200).json({
				message: 'Product deleted',
				request: {
					type: 'POST',
					url: 'http://localhost:5000/products',
					body: { name: 'String', price: 'Number' },
				},
			});
		} catch (error) {
			res.status(500).json({ error });
		}
	},
};
