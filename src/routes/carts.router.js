import { Router } from "express";
import {
    createCart,
    getCart,
    addProductToCart,
    removeProductFromCart,
    purchaseCart
} from "../controllers/carts.controller.js";

import { passportCall } from "../utils/passportCall.js";
import { authorization } from "../middlewares/auth.middleware.js";

const router = Router();

/* CREAR CARRITO */
router.post("/", createCart);

/* OBTENER CARRITO */
router.get("/:cid", getCart);

/* AGREGAR PRODUCTO (solo user) */
router.post(
    "/:cid/product/:pid",
    passportCall("current"),
    authorization("user"),
    addProductToCart
);

/* ELIMINAR PRODUCTO */
router.delete(
    "/:cid/products/:pid",
    passportCall("current"),
    authorization("user"),
    removeProductFromCart
);

/* FINALIZAR COMPRA */
router.post(
    "/:cid/purchase",
    passportCall("current"),
    authorization("user"),
    purchaseCart
);

export default router;