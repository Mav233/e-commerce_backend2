import { CartModel } from "../../models/cart.model.js";

export default class CartsDAO {

    async getById(id) {
        return await CartModel.findById(id).populate("products.product");
    }

    async create() {
        return await CartModel.create({ products: [] });
    }

    async update(id, data) {
        return await CartModel.findByIdAndUpdate(id, data, { new: true });
    }
}