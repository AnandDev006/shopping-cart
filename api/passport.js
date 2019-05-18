const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const { ExtractJwt } = require('passport-jwt');

const {
	JWT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	FACEBOOK_CLIENT_ID,
	FACEBOOK_CLIENT_SECRET,
} = require('./configurations');
const User = require('./models/user');

// JSON WEB TOKENS STATEGY
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromHeader('authorization'),
			secretOrKey: JWT_SECRET,
		},
		async (payload, done) => {
			try {
				const user = await User.findById(payload.sub);
				if (!user) {
					return done(null, false);
				}

				done(null, user);
			} catch (error) {
				done(error, false);
			}
		}
	)
);

// LOCAL STRATEGY
passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		async (email, password, done) => {
			try {
				// Find user given the email
				const user = await User.findOne({ 'local.email': email });

				// If user doesn't exist
				if (!user) {
					return done(null, false);
				}

				// Check if password is correct
				const isMatch = await user.isValidPassword(password);

				// If password is wrong
				if (!isMatch) {
					return done(null, false);
				}

				done(null, user);
			} catch (error) {
				done(error, false);
			}
		}
	)
);

// GOOGLE OAUTH STRATEGY
passport.use(
	'googleToken',
	new GooglePlusTokenStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Check if user exists in our DB
				const existingUser = await User.findOne({
					'google.id': profile.id,
				});

				// If user exists
				if (existingUser) {
					return done(null, existingUser);
				}

				// If new account
				const newUser = new User({
					method: 'google',
					google: {
						id: profile.id,
						email: profile.emails[0].value,
					},
				});

				await newUser.save();

				done(null, newUser);
			} catch (error) {
				done(error, false, error.message);
			}
		}
	)
);

// FACEBOOK OAUTH STRATEGY
passport.use(
	'facebookToken',
	new FacebookTokenStrategy(
		{
			clientID: FACEBOOK_CLIENT_ID,
			clientSecret: FACEBOOK_CLIENT_SECRET,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Check if user exists in our DB
				const existingUser = await User.findOne({
					'facebook.id': profile.id,
				});

				// If user exists
				if (existingUser) {
					return done(null, existingUser);
				}
				// If new account
				const newUser = new User({
					method: 'facebook',
					facebook: {
						id: profile.id,
						email: profile.emails[0].value,
					},
				});

				await newUser.save();
				done(null, newUser);
			} catch (error) {
				done(error, false, error.message);
			}
		}
	)
);
