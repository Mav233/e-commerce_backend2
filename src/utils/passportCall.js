import passport from "passport";

export const passportCall = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (err, user) => {
            if (err) return next(err);

            req.user = user || null;
            next();
        })(req, res, next);
    };
};