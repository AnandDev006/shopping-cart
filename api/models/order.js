const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
	_id: Schema.Types.ObjectId,
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	ordersList: [
		{
			productId: {
				type: Schema.Types.ObjectId,
				required: true,
			},
			product: {
				type: Object,
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
				default: 1,
			},
		},
	],
});

module.exports = mongoose.model('order', orderSchema);
