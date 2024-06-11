const profileRoutes = require("express").Router();
const profileController = require("../controllers/profileControllers");

profileRoutes.get("/api/profiles", profileController.getAllProfiles);
profileRoutes.get("/api/profiles/search", profileController.searchProfile)
profileRoutes.get("/api/profiles/:id", profileController.getProfileById);
profileRoutes.post("/api/profiles", profileController.createProfile);
profileRoutes.patch("/api/profiles/:id", profileController.updateProfile);
profileRoutes.delete("/api/profiles/:id", profileController.deleteProfile);

module.exports = profileRoutes;
