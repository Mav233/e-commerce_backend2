import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

/* REGISTER */
router.post(
    "/register",
    passport.authenticate("register", {
        session: false,
        failureRedirect: "/register?error=true",
    }),
    (req, res) => {
        res.redirect("/login");
    }
);

/* LOGIN */
router.post(
    "/login",
    passport.authenticate("login", {
        session: false,
        failureRedirect: "/login?error=true",
    }),
    (req, res) => {
        const user = req.user;

        const token = jwt.sign(
            {
                user: {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role,
                },
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
        });

        res.redirect("/profile"); // ✅
    }
);

/* CURRENT */
router.get(
    "/current",
    passport.authenticate("current", { session: false }),
    (req, res) => {
        res.json({
            status: "success",
            user: req.user,
        });
    }
);

/* LOGOUT */
router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/login");
});

export default router;