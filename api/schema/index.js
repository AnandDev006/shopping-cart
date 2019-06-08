const graphql = require('graphql');
const _ = require('lodash');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
} = graphql;

const Product = require('../models/product');
const Order = require('../models/order');

const ProductType = new GraphQLObjectType({
	name: 'Product',
	fields: {
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		price: { type: GraphQLInt },
	},
});

const OrderItemType = new GraphQLObjectType({
	name: 'OrderItem',
	fields: {
		product: { type: ProductType },
		quantity: { type: GraphQLInt },
	},
});

const OrderType = new GraphQLObjectType({
	name: 'Order',
	fields: {
		_id: { type: GraphQLID },
		ordersList: {
			type: new GraphQLList(OrderItemType),
		},
	},
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
		product: {
			type: ProductType,
			args: { id: { type: GraphQLString } },
			async resolve(parent, { id }) {
				return await Product.findById(id);
			},
		},

		products: {
			type: new GraphQLList(ProductType),
			async resolve(parent, args) {
				return await Product.find();
			},
		},

		order: {
			type: OrderType,
			args: { userId: { type: GraphQLString } },
			async resolve(parent, { userId }) {
				return await Order.findOne({ userId });
			},
		},
	},
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	// mutation: Mutation,
});
