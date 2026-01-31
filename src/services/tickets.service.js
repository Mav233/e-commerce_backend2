import TicketsRepository from "../repositories/tickets.repository.js";
import TicketDTO from "../dto/ticket.dto.js";
import crypto from "crypto";

export default class TicketsService {
    constructor() {
        this.repository = new TicketsRepository();
    }

    async createTicket({ amount, purchaser }) {
        const ticketData = {
            code: crypto.randomUUID(),
            amount,
            purchaser
        };

        const ticket = await this.repository.createTicket(ticketData);
        return new TicketDTO(ticket);
    }
}