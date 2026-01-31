import CartsRepository from "../repositories/carts.repository.js";
import ProductsRepository from "../repositories/products.repository.js";
import TicketsService from "./tickets.service.js";
import MailService from "./mail.service.js";

class CartsService {
    constructor() {
        this.cartsRepo = new CartsRepository();
        this.productsRepo = new ProductsRepository();
        this.ticketsService = new TicketsService();
    }

    async createCart() {
        return await this.cartsRepo.create();
    }

    async getCart(cid) {
        const cart = await this.cartsRepo.getById(cid);
        if (!cart) throw new Error("Carrito no encontrado");
        return cart;
    }

    async addProduct(cid, pid) {
        const cart = await this.getCart(cid);

        const index = cart.products.findIndex(
            p => p.product._id.toString() === pid
        );

        if (index !== -1) {
            cart.products[index].quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        return await this.cartsRepo.update(cid, { products: cart.products });
    }

    async removeProduct(cid, pid) {
        const cart = await this.getCart(cid);

        cart.products = cart.products.filter(
            p => p.product._id.toString() !== pid
        );

        return await this.cartsRepo.update(cid, { products: cart.products });
    }

    async purchase(cid, purchaserEmail) {
        const cart = await this.getCart(cid);

        let totalAmount = 0;
        const rejectedProducts = [];
        const purchasedProducts = [];

        for (const item of cart.products) {
            const product = item.product;

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                totalAmount += product.price * item.quantity;
                await product.save();
                purchasedProducts.push(product._id.toString());
            } else {
                rejectedProducts.push(product._id.toString());
            }
        }

        cart.products = cart.products.filter(
            p => rejectedProducts.includes(p.product._id.toString())
        );

        await cart.save();

        let ticket = null;

        if (totalAmount > 0) {
            ticket = await this.ticketsService.createTicket({
                amount: totalAmount,
                purchaser: purchaserEmail
            });

            // 📩 ENVÍO DE MAIL
            await MailService.sendPurchaseMail({
                to: purchaserEmail,
                ticket,
                rejectedProducts
            });
        }

        return {
            status: "success",
            ticket,
            rejectedProducts
        };
    }
}

export default new CartsService();