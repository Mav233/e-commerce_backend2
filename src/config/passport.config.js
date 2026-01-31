import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

/* COOKIE EXTRACTOR */
const cookieExtractor = req => {
    return req?.cookies?.jwt || null;
};

const initializePassport = () => {

/* REGISTER */
    passport.use(
        "register",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email"
            },
            async (req, email, password, done) => {
                try {
                    const { first_name, last_name } = req.body;

                    const exists = await UserModel.findOne({ email });
                    if (exists) {
                        return done(null, false);
                    }

                    let role = "user";

                    if (email === "admin@admin.com") {
                        role = "admin";
                    }

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        password: createHash(password),
                        role
                    };

                    const user = await UserModel.create(newUser);
                    return done(null, user);

                } catch (error) {
                    return done(error);
                }
            }
        )
    );

/* LOGIN */
    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (email, password, done) => {
                try {
                    const user = await UserModel.findOne({ email });
                    if (!user) return done(null, false);

                    if (!isValidPassword(user, password)) {
                        return done(null, false);
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

/* CURRENT (JWT) */
    passport.use(
        "current",
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: process.env.JWT_SECRET
            },
            async (payload, done) => {
                try {
                    const user = await UserModel.findById(payload.id);
                    if (!user) return done(null, false);
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};

export default initializePassport;