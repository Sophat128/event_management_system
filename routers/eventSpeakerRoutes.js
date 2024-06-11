const  eventSpeakersRoutes = require("express").Router();
const  eventSpeakersController = require("../controllers/eventSpeakerControllers")

eventSpeakersRoutes.get("/api/eventSpeakers",  eventSpeakersController.getAllSpeakers)
eventSpeakersRoutes.get("/api/eventSpeakers/:id",  eventSpeakersController.getEventSpeakersById)
eventSpeakersRoutes.post("/api/eventSpeakers",  eventSpeakersController.createEventSpeaker)
eventSpeakersRoutes.patch("/api/eventSpeakers/:id",  eventSpeakersController.updateEventSpeaker)
eventSpeakersRoutes.delete("/api/eventSpeakers/:id",  eventSpeakersController.deleteEventSpeaker)



module.exports = eventSpeakersRoutes;


