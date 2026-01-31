import ProductsRepository from "../repositories/products.repository.js";

class ProductsService {
    constructor() {
        this.repository = new ProductsRepository();
    }

    async getProducts(query = {}) {
        const {
            limit = 4,
            page = 1,
            category,
            stock,
            sort
        } = query;

        const filter = {};

        /* FILTROS */
        if (category) {
            filter.category = category;
        }

        if (stock === "available") {
            filter.stock = { $gt: 0 };
        } else if (stock === "empty") {
            filter.stock = 0;
        }

        /* SORT */
        let sortOption;
        if (sort === "asc") sortOption = { price: 1 };
        if (sort === "desc") sortOption = { price: -1 };

        /* PAGINATE */
        return await this.repository.paginate(filter, {
            page: Number(page) || 1,
            limit: Number(limit) || 4,
            sort: sortOption,
            lean: true
        });
    }

    async createProduct(body, file) {
        const { title, description, price, stock, category } = body;

        if (!title || !price || !stock) {
            throw new Error("Datos incompletos");
        }

        const newProduct = {
            title: title.trim(),
            description: description?.trim() || "",
            price: Number(price),
            stock: Number(stock),
            category,
            status: true,
            code: `${title
                .toUpperCase()
                .replace(/\s+/g, "-")}-${Date.now()}`,
            thumbnails: file ? [`/uploads/${file.filename}`] : []
        };

        return await this.repository.create(newProduct);
    }

    async updateProduct(id, data) {
        const product = await this.repository.update(id, data);
        if (!product) throw new Error("Producto no encontrado");
        return product;
    }

    async deleteProduct(id) {
        const product = await this.repository.delete(id);
        if (!product) throw new Error("Producto no encontrado");
        return product;
    }
}

export default new ProductsService();