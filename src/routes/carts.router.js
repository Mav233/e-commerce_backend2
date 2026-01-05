import { Router } from "express";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";

const router = Router();

/* CREAR CARRITO */
router.post("/", async (req, res) => {
    const cart = await CartModel.create({ products: [] });
    res.status(201).json({ status: "success", payload: cart });
});

/* OBTENER CARRITO */
router.get("/:cid", async (req, res) => {
    const cart = await CartModel.findById(req.params.cid)
        .populate("products.product");

    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    res.json({ status: "success", payload: cart });
});

/* AGREGAR PRODUCTO */
router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    const product = await ProductModel.findById(pid);

    if (!cart || !product) {
        return res.status(404).json({ error: "Carrito o producto inexistente" });
    }

    const item = cart.products.find(p => p.product.toString() === pid);

    if (item) item.quantity++;
    else cart.products.push({ product: pid, quantity: 1 });

    await cart.save();
    res.json({ status: "success", payload: cart });
});

/* ELIMINAR PRODUCTO */
router.delete("/:cid/products/:pid", async (req, res) => {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(
        p => p.product.toString() !== req.params.pid
    );

    await cart.save();
    res.json({ status: "success", payload: cart });
});

export default router;