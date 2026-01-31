import TicketsDAO from "../dao/mongo/tickets.dao.js";

export default class TicketsRepository {
    constructor() {
        this.dao = new TicketsDAO();
    }

    createTicket(ticketData) {
        return this.dao.create(ticketData);
    }

    getTicketById(id) {
        return this.dao.getById(id);
    }
}