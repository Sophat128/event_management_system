const userRoutes = require("express").Router();
const userController = require("../controllers/userControllers")

userRoutes.get("/api/users/:id", userController.getUserById)
userRoutes.get("/api/users/search", userController.searchUser)
userRoutes.get("/api/users", userController.getAllUsers)
userRoutes.post("/api/users", userController.createNewUser)
userRoutes.patch("/api/users/:id", userController.updateUser)
userRoutes.delete("/api/users/:id", userController.deleteUser)

module.exports = userRoutes;