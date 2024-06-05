const userRoutes = require("express").Router();
const userController = require("../controllers/userControllers")

userRoutes.get("/api/users/:id", userController.getUserById)
userRoutes.get("/api/allUsers", userController.getAllUsers)
userRoutes.post("/api/users", userController.createNewUser)
userRoutes.patch("/api/user/:id", userController.updateUser)
userRoutes.delete("/api/user/:id", userController.deleteUser)

module.exports = userRoutes;