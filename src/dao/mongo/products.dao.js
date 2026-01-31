import { ProductModel } from "../../models/product.model.js";

export default class ProductsDAO {
    async paginate(filter, options) {
        return await ProductModel.paginate(filter, options);
    }

    async create(productData) {
        return await ProductModel.create(productData);
    }

    async update(id, data) {
        return await ProductModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}