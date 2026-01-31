import { TicketModel } from "../../models/ticket.model.js";

export default class TicketsDAO {
    async create(ticketData) {
        return await TicketModel.create(ticketData);
    }

    async getById(id) {
        return await TicketModel.findById(id);
    }

    async getAll() {
        return await TicketModel.find();
    }
}