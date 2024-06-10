const  speakerRoutes = require("express").Router();
const  speakerController = require("../controllers/speakerControllers")

speakerRoutes.get("/api/speakers",  speakerController.getAllSpeakers)
// speakerRoutes.get("/api/speaker/:id",  speakerController.getspeakerById)
// speakerRoutes.post("/api/speaker",  speakerController.createspeaker)
// speakerRoutes.patch("/api/speaker/:id",  speakerController.updatespeaker)
// speakerRoutes.delete("/api/speaker/:id",  speakerController.deletespeaker)



module.exports = speakerRoutes;


// GET /speakers - List all speakers (with pagination)
// POST /speakers - Create a new speaker
// GET /speakers/{id} - Get a speaker by ID
// PUT /speakers/{id} - Update a speaker by ID
// DELETE /speakers/{id} - Delete a speaker by ID