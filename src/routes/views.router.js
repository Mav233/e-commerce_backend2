import { Router } from "express";
import productsService from "../services/products.service.js";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/cart.model.js";
import { passportCall } from "../utils/passportCall.js";

const router = Router();

const buildSafeUser = (user) => {
    if (!user) return null;

    return {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        cart: user.cart
    };
};

/* HOME */
router.get("/", passportCall("current"), (req, res) => {
    res.render("home", {
        user: buildSafeUser(req.user)
    });
});

/* LOGIN */
router.get("/login", (req, res) => {
    res.render("login");
});

/* REGISTER */
router.get("/register", (req, res) => {
    res.render("register");
});

/* PRODUCTS ( paginación + filtros) */
router.get("/products", passportCall("current"), async (req, res) => {
    const result = await productsService.getProducts(req.query);

    res.render("index", {
        products: result.docs,

        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,

        category: req.query.category || "",
        stock: req.query.stock || "",
        sort: req.query.sort || "",

        user: buildSafeUser(req.user)
    });
});

/* NUEVO PRODUCTO (solo admin) */
router.get(
    "/products/new",
    passportCall("current"),
    (req, res) => {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).render("error", {
                message: "Acceso denegado",
                user: buildSafeUser(req.user)
            });
        }

        res.render("productForm", {
            user: buildSafeUser(req.user)
        });
    }
);

/* PRODUCT DETAIL */
router.get("/products/:pid", passportCall("current"), async (req, res) => {
    const product = await ProductModel.findById(req.params.pid).lean();

    if (!product) {
        return res.status(404).render("error", {
            message: "Producto no encontrado"
        });
    }

    res.render("productDetail", {
        product,
        cartId: req.user.cart.toString(), // 🔥 CLAVE
        user: req.user
    });
});

/* CART */
router.get("/carts/:cid", passportCall("current"), async (req, res) => {
    const cart = await CartModel.findById(req.params.cid)
        .populate("products.product")
        .lean();

    if (!cart) {
        return res.status(404).render("error", {
            message: "Carrito no encontrado",
            user: buildSafeUser(req.user)
        });
    }

    res.render("checkout", {
        cart,
        user: buildSafeUser(req.user)
    });
});

export default router;