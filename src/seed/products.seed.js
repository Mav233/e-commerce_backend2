import mongoose from "mongoose";
import "dotenv/config";
import { ProductModel } from "../models/product.model.js";

const products = [
    {
        title: "Notebook Lenovo",
        description: "Notebook Lenovo i5 16GB RAM",
        code: "LENOVO-IDEAPAD-3",
        price: 850000,
        stock: 10,
        category: "tecnologia",
        thumbnails: ["lenovo.jpg"]
    },
    {
        title: "Mouse Logitech",
        description: "Mouse inalámbrico Logitech",
        code: "LOGITECH-MOUSE",
        price: 15000,
        stock: 50,
        category: "accesorios",
        thumbnails: ["mouse.jpg"]
    },
    {
        title: "Teclado Mecánico",
        description: "Teclado mecánico RGB",
        code: "MECHANICAL-KEYBOARD",
        price: 45000,
        stock: 20,
        category: "accesorios",
        thumbnails: ["teclado.jpg"]
    },
];

while (products.length < 15) {
    products.push({
        ...products[products.length % 3],
        title: products[products.length % 3].title + " " + products.length
    });
}

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        await ProductModel.deleteMany(); // limpia colección
        await ProductModel.insertMany(products);
        console.log("🔥 Productos cargados correctamente");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();