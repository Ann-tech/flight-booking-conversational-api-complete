const express = require('express');
const authRouter = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

authRouter.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
    res.json({
        success: true,
        message: 'signup successful'
    });
});
authRouter.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err) {
                return next(err);
            }
            if (!user) {
                const error = new Error('email or password is incorrect');
                return next(error);
            }

            req.login(user, { session: false },
                async (error) => {
                    if (error) return next(error);

                    const body = { id: user.id, email: user.email };
                    //You store the id and email in the payload of the JWT. 
                    // You then sign the token with a secret or key (JWT_SECRET), and send back the token to the user.
                    // DO NOT STORE PASSWORDS IN THE JWT!
                    const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1h' });

                    return res.json({ message: "login successful", token });
                }
            );
        } catch (error) {
            return next(error);
        }
    }
    )(req, res, next);
})
module.exports = authRouter;