const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const passportConf = require('../passport');
const ProductsController = require('../controller/products');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const passportSecretJWT = passport.authenticate('jwt', { session: false });

router.route('/').get(ProductsController.getAllProducts);

router
	.route('/')
	.post(
		validateBody(schemas.addProductSchema),
		passportSecretJWT,
		ProductsController.addNewProduct
	);

router.route('/:productId').get(ProductsController.getProductDetails);

router
	.route('/:productId')
	.patch(
		validateBody(schemas.editProductSchema),
		passportSecretJWT,
		ProductsController.editProductDetails
	);

router
	.route('/:productId')
	.delete(passportSecretJWT, ProductsController.deleteProduct);

module.exports = router;
