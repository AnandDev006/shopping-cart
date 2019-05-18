const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
	_id: Schema.Types.ObjectId,
	method: {
		type: String,
		enum: ['local', 'google', 'facebook'],
		required: true,
	},
	local: {
		name: {
			type: String,
		},
		email: {
			type: String,
			lowercase: true,
		},
		password: {
			type: String,
		},
	},
	google: {
		id: {
			type: String,
		},
		email: {
			type: String,
			lowercase: true,
		},
	},
	facebook: {
		id: {
			type: String,
		},
		email: {
			type: String,
			lowercase: true,
		},
	},
	register_date: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.pre('save', async function(next) {
	try {
		if (this.method !== 'local') {
			next();
		}

		// Generate a salt
		const salt = await bcrypt.genSalt(10);

		// Hash the password
		const passwordHash = await bcrypt.hash(this.local.password, salt);

		// set the user object password to the hashed password
		this.local.password = passwordHash;
		next();
	} catch (error) {
		next(error);
	}
});

UserSchema.methods.isValidPassword = async function(newPassword) {
	try {
		return await bcrypt.compare(newPassword, this.local.password);
	} catch (error) {
		throw new Error(error);
	}
};

// Create a model
const User = mongoose.model('user', UserSchema);

// Export the model
module.exports = User;
