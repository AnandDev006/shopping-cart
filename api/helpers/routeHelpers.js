const Joi = require('joi');

module.exports = {
	validateBody: schema => (req, res, next) => {
		const result = Joi.validate(req.body, schema);
		if (result.error) {
			return res.status(400).json(result.error);
		}

		if (!req.value) {
			req.value = {};
		}
		req.value.body = result.value;
		next();
	},
	schemas: {
		signUpSchema: Joi.object().keys({
			name: Joi.string().required(),
			email: Joi.string()
				.email()
				.required(),
			password: Joi.string().required(),
		}),
		signInSchema: Joi.object().keys({
			email: Joi.string()
				.email()
				.required(),
			password: Joi.string().required(),
		}),
		addProductSchema: Joi.object().keys({
			name: Joi.string().required(),
			price: Joi.number().required(),
		}),
		editProductSchema: Joi.object().keys({
			name: Joi.string(),
			price: Joi.number(),
		}),
		addOrderItemSchema: Joi.object().keys({
			orderId: Joi.string(),
			product: Joi.object().required(),
		}),
		editOrderItemSchema: Joi.object().keys({
			orderId: Joi.string().required(),
			productId: Joi.string().required(),
			quantity: Joi.number().required(),
		}),
		deleteOrderItemSchema: Joi.object().keys({
			orderId: Joi.string().required(),
			productId: Joi.string().required(),
		}),
	},
};
