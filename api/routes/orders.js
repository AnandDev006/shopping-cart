const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const passportConf = require('../passport');
const OrderController = require('../controller/orders');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const passportSecretJWT = passport.authenticate('jwt', { session: false });

router.route('/:userId').get(passportSecretJWT, OrderController.getOrders);

router
	.route('/:userId')
	.post(
		validateBody(schemas.addOrderItemSchema),
		passportSecretJWT,
		OrderController.addOrderItem
	);

router
	.route('/:userId')
	.patch(
		validateBody(schemas.editOrderItemSchema),
		passportSecretJWT,
		OrderController.editOrderItem
	);

router
	.route('/:userId')
	.delete(
		validateBody(schemas.deleteOrderItemSchema),
		passportSecretJWT,
		OrderController.deleteOrderItem
	);

module.exports = router;
