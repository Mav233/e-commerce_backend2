import { Router } from "express";
import { ProductModel } from "../models/product.model.js";
import { uploader } from "../utils/uploader.js";

const router = Router();

/* GET */

router.get("/", async (req, res) => {
    try {
        const {
            limit = 10,
            page = 1,
            category,
            stock,
            sort
        } = req.query;

        const filter = {};

        // filtro por categoría
        if (category) {
            filter.category = category;
        }

        // filtro por stock
        if (stock === "available") {
            filter.stock = { $gt: 0 };
        } else if (stock === "empty") {
            filter.stock = 0;
        }

        // ordenamiento por precio
        let sortOption = {};
        if (sort === "asc") sortOption.price = 1;
        if (sort === "desc") sortOption.price = -1;

        const result = await ProductModel.paginate(filter, {
            page: Number(page),
            limit: Number(limit),
            sort: sortOption,
            lean: true
        });

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

/* POST */

router.post("/", uploader.single("thumbnail"), async (req, res) => {
    try {
        const { title, description, price, stock, category } = req.body;

        const newProduct = {
            title,
            description,
            price: Number(price),
            stock: Number(stock),
            category,
            status: true,
            code: `${title.toUpperCase().replace(/\s+/g, "-")}-${Date.now()}`,
            thumbnails: req.file ? [`/uploads/${req.file.filename}`] : []
        };

        await ProductModel.create(newProduct);

        res.redirect("/products");

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear el producto");
    }
});

/* PUT */

router.put("/:pid", async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndUpdate(
            req.params.pid,
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                status: "error",
                error: "Producto no encontrado"
            });
        }

        res.json({
            status: "success",
            payload: product
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

/* DELETE */

router.delete("/:pid", async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.pid);

        if (!product) {
            return res.status(404).json({
                status: "error",
                error: "Producto no encontrado"
            });
        }

        res.json({
            status: "success",
            message: "Producto eliminado"
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

export default router;