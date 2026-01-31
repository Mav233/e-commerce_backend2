import cartsService from "../services/carts.service.js";

export const createCart = async (req, res) => {
    try {
        const cart = await cartsService.createCart();
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const cart = await cartsService.getCart(req.params.cid);
        res.json({ status: "success", payload: cart });
    } catch (error) {
        res.status(404).json({ status: "error", error: error.message });
    }
};

/* AGREGAR PRODUCTO AL CARRITO (USER) */
export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        await cartsService.addProduct(cid, pid);

        res.redirect(`/products/${pid}?added=success`);

    } catch (error) {
        console.error(error);
        res.redirect(`/products/${req.params.pid}?added=error`);
    }
};

export const removeProductFromCart = async (req, res) => {
    try {
        const cart = await cartsService.removeProduct(
            req.params.cid,
            req.params.pid
        );
        res.json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

export const purchaseCart = async (req, res) => {
    try {
        const { ticket, rejectedProducts } = await cartsService.purchase(
            req.params.cid,
            req.user.email
        );

        if (!ticket) {
            return res.status(400).json({
                status: "error",
                message: "No se pudo completar la compra",
                rejectedProducts
            });
        }

        res.json({
            status: "success",
            message: "Compra realizada con éxito",
            ticket,
            rejectedProducts
        });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};