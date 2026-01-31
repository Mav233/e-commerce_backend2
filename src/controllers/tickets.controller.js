import TicketsService from "../services/tickets.service.js";

const ticketsService = new TicketsService();

export const getTicketById = async (req, res) => {
    try {
        const ticket = await ticketsService.getTicketById(req.params.tid);
        res.json({ status: "success", payload: ticket });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};