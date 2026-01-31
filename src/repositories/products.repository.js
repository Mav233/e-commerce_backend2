import ProductsDAO from "../dao/mongo/products.dao.js";

export default class ProductsRepository {
    constructor() {
        this.dao = new ProductsDAO();
    }

    paginate(filter, options) {
        return this.dao.paginate(filter, options);
    }

    create(productData) {
        return this.dao.create(productData);
    }

    update(id, data) {
        return this.dao.update(id, data);
    }

    delete(id) {
        return this.dao.delete(id);
    }
}