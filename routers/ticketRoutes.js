const ticketRoutes = require("express").Router();
const ticketController = require("../controllers/ticketControllers")

ticketRoutes.get("/api/tickets", ticketController.getAllTickets)
ticketRoutes.get("/api/tickets/:id", ticketController.getTicketById)
ticketRoutes.post("/api/tickets", ticketController.createTicket)
ticketRoutes.put("/api/tickets/:id", ticketController.updateTicket)
ticketRoutes.put("/api/tickets/:id", ticketController.deleteTicket)



module.exports = ticketRoutes;