const  eventspeakersRoutes = require("express").Router();
const  eventspeakersController = require("../controllers/eventspeakersControllers")

eventspeakersRoutes.get("/api/eventspeakers",  eventspeakersController.getAllEventspeakers)
eventspeakersRoutes.get("/api/eventspeakers/:id",  eventspeakersController.getEventspeakersById)
eventspeakersRoutes.post("/api/eventspeakers",  eventspeakersController.createEventspeakers)
eventspeakersRoutes.delete("/api/eventspeakers/:id",  eventspeakersController.deleteEventspeakers)



module.exports = eventspeakersRoutes;

// GET /eventspeakers - List all event-speaker assignments (with pagination)
// POST /eventspeakers - Assign a speaker to an event
// DELETE /eventspeakers - Remove a speaker from an event
