const JWT = require('jsonwebtoken');

const { JWT_SECRET } = require('../configurations');
const User = require('../models/user');

const signToken = newUser => {
	return JWT.sign(
		{
			iss: 'Anand',
			sub: newUser.id,
			iat: new Date().getTime(),
			exp: new Date().setDate(new Date().getDate() + 1),
		},
		JWT_SECRET
	);
};

module.exports = {
	signUp: async (req, res, next) => {
		const { name, email, password } = req.value.body;

		// Check if user exist with same email
		const foundUser = await User.findOne({ 'local.email': email });
		if (foundUser) {
			return res.status(403).json({ msg: 'Email already in use' });
		}

		// Create new user
		const newUser = new User({
			method: 'local',
			local: {
				name,
				email,
				password,
			},
		});

		const result = await newUser.save();

		const token = signToken(newUser);

		// Respond with token
		res.status(200).json({ token, userId: result._id });
	},

	signIn: async (req, res, next) => {
		const token = signToken(req.user);

		// Respond with token
		res.status(200).json({ token, userId: req.user._id });
	},

	googleOAuth: async (req, res, next) => {
		const token = signToken(req.user);

		// Respond with token
		res.status(200).json({ token, userId: req.user._id });
	},

	facebookOAuth: async (req, res, next) => {
		const token = signToken(req.user);

		// Respond with token
		res.status(200).json({ token, userId: req.user._id });
	},

	secret: async (req, res, next) => {
		res.json({ msg: 'authorized' });
	},
};
