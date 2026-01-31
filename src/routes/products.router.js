import { Router } from "express";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/products.controller.js";

import { uploader } from "../utils/uploader.js";
import { passportCall } from "../utils/passportCall.js";
import { authorization } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getProducts);

router.post(
    "/",
    passportCall("current"),
    authorization("admin"),
    uploader.single("thumbnail"),
    createProduct
);

router.put(
    "/:pid",
    passportCall("current"),
    authorization("admin"),
    updateProduct
);

router.delete(
    "/:pid",
    passportCall("current"),
    authorization("admin"),
    deleteProduct
);

export default router;