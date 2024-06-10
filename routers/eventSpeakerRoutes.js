const  eventSpeakersRoutes = require("express").Router();
const  eventSpeakersController = require("../controllers/eventSpeakerControllers")

eventSpeakersRoutes.get("/api/eventSpeakers",  eventSpeakersController.getAllSpeakers)
eventSpeakersRoutes.get("/api/eventSpeakers/:id",  eventSpeakersController.getEventspeakersById)
eventSpeakersRoutes.post("/api/eventSpeakers",  eventSpeakersController.createEventspeakers)
eventSpeakersRoutes.delete("/api/eventSpeakers/:id",  eventSpeakersController.deleteeventspeakers)



module.exports = eventSpeakersRoutes;

// GET /eventspeakers - List all event-speaker assignments (with pagination)
// POST /eventspeakers - Assign a speaker to an event
// DELETE /eventspeakers - Remove a speaker from an event
