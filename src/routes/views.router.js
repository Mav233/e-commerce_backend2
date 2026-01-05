import { Router } from "express";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/cart.model.js";

import passport from "passport";


const router = Router();

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

/* PROFILE (ruta protegida) */
router.get(
    "/profile",
    passport.authenticate("current", { session: false }),
    (req, res) => {
        res.render("profile", {
            user: req.user
        });
    }
);

/* HOME */
router.get("/", (req, res) => {
    res.render("home");
});

/* CHECKOUT */
router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid)
            .populate("products.product")
            .lean();

        if (!cart) {
            return res.send("Carrito no encontrado");
        }

        res.render("checkout", { cart });

    } catch (error) {
        console.error(error);
        res.send("Error al cargar el carrito");
    }
});

/* AGREGAR PRODUCTO AL CARRITO */
router.post("/carts/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        await fetch(`http://localhost:8080/api/carts/${cid}/product/${pid}`, {
            method: "POST"
        });

        res.redirect(`/carts/${cid}`);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al agregar producto");
    }
});

/* AUMENTAR CANTIDAD */
router.post("/carts/:cid/products/:pid/increase", async (req, res) => {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.redirect(`/carts/${cid}`);

    const item = cart.products.find(
        p => p.product.toString() === pid
    );

    if (!item) return res.redirect(`/carts/${cid}`);

    // buscar producto real para conocer el stock
    const product = await ProductModel.findById(pid);
    if (!product) return res.redirect(`/carts/${cid}`);

    // VALIDACIÓN DE STOCK
    if (item.quantity < product.stock) {
        item.quantity += 1;
        await cart.save();
    }

    res.redirect(`/carts/${cid}`);
});

/*  DISMINUIR CANTIDAD */
router.post("/carts/:cid/products/:pid/decrease", async (req, res) => {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.redirect(`/carts/${cid}`);

    const item = cart.products.find(
        p => p.product.toString() === pid
    );

    if (!item) return res.redirect(`/carts/${cid}`);

    if (item.quantity > 1) {
        item.quantity -= 1;
        await cart.save();
    }

    res.redirect(`/carts/${cid}`);
});

/*  ELIMINAR PRODUCTO */
router.post("/carts/:cid/products/:pid/delete", async (req, res) => {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.send("Carrito no encontrado");

    cart.products = cart.products.filter(
        p => p.product.toString() !== pid
    );

    await cart.save();
    res.redirect(`/carts/${cid}`);
});

/* FINALIZAR COMPRA */
router.post("/carts/:cid/checkout", async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            return res.redirect("/products");
        }

        // 🔥 vaciar carrito
        cart.products = [];
        await cart.save();

        // flag para mostrar toast
        res.redirect("/products?checkout=success");

    } catch (error) {
        res.redirect("/products");
    }
});

/*  FORM NUEVO PRODUCTO */
router.get("/products/new", (req, res) => {
    res.render("productForm");
});

/* LISTADO DE PRODUCTOS */
router.get("/products", async (req, res) => {
    try {
        const {
            limit = 3,
            page = 1,
            category,
            stock,
            sort
        } = req.query;

        const filter = {};

        if (category) filter.category = category;
        if (stock === "available") filter.stock = { $gt: 0 };
        if (stock === "empty") filter.stock = 0;

        let sortOption = {};
        if (sort === "asc") sortOption.price = 1;
        if (sort === "desc") sortOption.price = -1;

        const result = await ProductModel.paginate(filter, {
            page: Number(page),
            limit: Number(limit),
            sort: sortOption,
            lean: true
        });

        res.render("index", {
            title: "E-commerce Scopper",
            products: result.docs,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            category,
            stock,
            sort
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error cargando productos");
    }
});

/* DETALLE DE PRODUCTO */
router.get("/products/:pid", async (req, res) => {
    const product = await ProductModel.findById(req.params.pid).lean();

    const cartId = "695acc8c9e494d24f14d6da3";

    res.render("productDetail", {
        product,
        cartId
    });
});

/* REAL TIME PRODUCTS */
router.get("/realtimeproducts", async (req, res) => {
    const products = await ProductModel.find().lean();
    res.render("realTimeProducts", { products });
});

export default router;