import productsService from "../services/products.service.js";
import ProductDTO from "../dto/products.dto.js";

export const getProducts = async (req, res) => {
    try {
        const result = await productsService.getProducts(req.query);

        // Aplicacion de DTO  a los productos obtenidos
        const productsDTO = result.docs.map(p => new ProductDTO(p));

        res.render("index", {
            products: productsDTO,
            pagination: {
                totalPages: result.totalPages,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage
            },
            user: req.user ?? null
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener productos");
    }
};

export const createProduct = async (req, res) => {
    try {
        await productsService.createProduct(req.body, req.file);

        res.redirect("/products");

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear el producto");
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await productsService.updateProduct(
            req.params.pid,
            req.body
        );

        const productDTO = new ProductDTO(product);

        res.json({
            status: "success",
            payload: productDTO
        });

    } catch (error) {
        res.status(404).json({
            status: "error",
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await productsService.deleteProduct(req.params.pid);

        res.json({
            status: "success",
            message: "Producto eliminado"
        });

    } catch (error) {
        res.status(404).json({
            status: "error",
            error: error.message
        });
    }
};