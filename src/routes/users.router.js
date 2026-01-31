import { Router } from "express";
import { getUsers, getUserById } from "../controllers/users.controller.js";
import { passportCall } from "../utils/passportCall.js";
import { authorization } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
    "/",
    passportCall("current"),
    authorization("admin"),
    getUsers
);

router.get(
    "/:uid",
    passportCall("current"),
    authorization("admin"),
    getUserById
);

export default router;