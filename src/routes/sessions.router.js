import { Router } from "express";
import passport from "passport";
import {
    register,
    login,
    current,
    logout
} from "../controllers/sessions.controller.js";
import { passportCall } from "../utils/passportCall.js";

const router = Router();

/* REGISTER */
router.post(
    "/register",
    passport.authenticate("register", { session: false }),
    register
);

/* LOGIN */
router.post(
    "/login",
    passport.authenticate("login", { session: false }),
    login
);

/* CURRENT */
router.get(
    "/current",
    passportCall("current"),
    current
);

/* LOGOUT */
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

export default router;