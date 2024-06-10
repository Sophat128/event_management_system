const eventRoutes = require("express").Router();
const eventController = require("../controllers/eventControllers")

eventRoutes.get("/api/events", eventController.getAllEvents)
eventRoutes.get("/api/events/search", eventController.searchEvent)
eventRoutes.get("/api/events/:id", eventController.getEventById)
eventRoutes.post("/api/events", eventController.createEvent)
eventRoutes.patch("/api/events/:id", eventController.updateEvent)
eventRoutes.delete("/api/events/:id", eventController.deleteEvent)



module.exports = eventRoutes;