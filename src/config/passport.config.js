import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model.js";

/* COOKIE EXTRACTOR */
const cookieExtractor = req => {
    if (req && req.cookies) {
        return req.cookies.jwt;
    }
    return null;
};

/* PASSPORT INITIALIZER */
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
                    const { first_name, last_name, age } = req.body;

                    const exists = await UserModel.findOne({ email });
                    if (exists) {
                        return done(null, false);
                    }

                    const hashedPassword = bcrypt.hashSync(password, 10);

                    const user = await UserModel.create({
                        first_name,
                        last_name,
                        age,
                        email,
                        password: hashedPassword,
                        role: "user"
                    });

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
            {
                usernameField: "email"
            },
            async (email, password, done) => {
                try {
                    const user = await UserModel.findOne({ email });
                    if (!user) return done(null, false);

                    const isValid = bcrypt.compareSync(password, user.password);
                    if (!isValid) return done(null, false);

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    /* CURRENT (JWT desde cookie) */

    passport.use("current", new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET,
    }, async (payload, done) => {
        try {
            return done(null, payload.user);
        } catch (error) {
            return done(error);
        }
    }));

};

export default initializePassport;