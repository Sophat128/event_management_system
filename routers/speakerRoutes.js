const  speakerRoutes = require("express").Router();
const  speakerController = require("../controllers/speakerControllers")

speakerRoutes.get("/api/speakers",  speakerController.getAllSpeakers)
speakerRoutes.get("/api/speakers/search",  speakerController.searchSpeaker)
speakerRoutes.get("/api/speakers/:id",  speakerController.getSpeakerById)
speakerRoutes.post("/api/speakers",  speakerController.createSpeaker)
speakerRoutes.patch("/api/speakers/:id",  speakerController.updateSpeaker)
speakerRoutes.delete("/api/speakers/:id",  speakerController.deleteSpeaker)



module.exports = speakerRoutes;


// GET /speakers - List all speakers (with pagination)
// POST /speakers - Create a new speaker
// GET /speakers/{id} - Get a speaker by ID
// PUT /speakers/{id} - Update a speaker by ID
// DELETE /speakers/{id} - Delete a speaker by ID