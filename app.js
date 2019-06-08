const express = require('express');
const graphqlHTTP = require('express-graphql');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { MONGO_URI } = require('./api/configurations');

// Connect to mongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true });

const authRoutes = require('./api/routes/users');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const schema = require('./api/schema');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Authorization'
	);
	if (req.method === 'OPTIONS') {
		req.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET, PATCH');
		return res.status(200).json({});
	}
	next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/graphql', graphqlHTTP({ schema, graphiql: true }));

// Start server
const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening at ${port}`);

app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

// Global error catcher
app.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		message: err.message,
	});
});
