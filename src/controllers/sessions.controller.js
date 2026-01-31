import jwt from "jsonwebtoken";
import UserDTO from "../dto/user.dto.js";
import { CartModel } from "../models/cart.model.js";

/* REGISTER */
export const register = async (req, res) => {
    try {
        const user = req.user;

        // crear carrito vacío
        const cart = await CartModel.create({ products: [] });

        // asociar carrito al usuario
        user.cart = cart._id;
        await user.save();

        res.redirect("/login?register=success");

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al registrar usuario");
    }
};

/* LOGIN */
export const login = (req, res) => {
    const user = req.user;

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict"
    });

    res.redirect("/products?login=success");
};

/* CURRENT */
export const current = (req, res) => {
    res.json({
        status: "success",
        payload: new UserDTO(req.user)
    });
};

/* LOGOUT */
export const logout = (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/login?logout=success");
};