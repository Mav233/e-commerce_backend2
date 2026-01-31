import CartsDAO from "../dao/mongo/carts.dao.js";

export default class CartsRepository {
    constructor() {
        this.dao = new CartsDAO();
    }

    getById(id) {
        return this.dao.getById(id);
    }

    create() {
        return this.dao.create();
    }

    update(id, data) {
        return this.dao.update(id, data);
    }
}