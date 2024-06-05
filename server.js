const dotenv = require("dotenv");
dotenv.config()

const express = require("express");
const eventRoutes = require("./routers/eventRoutes");
const morgan = require("morgan");
const ticketRoutes = require("./routers/ticketRoutes");
const app = express();
const userRoutes = require("./routers/userRoutes");

app.use(morgan("common"))
app.set("view engine", 'ejs')
app.use(express.json())
app.use("/assets", express.static("public"))
app.use("",eventRoutes)
app.use("",ticketRoutes)
app.use("",userRoutes)


app.listen(process.env.PORT, ()=> {
  console.log("Server is running on http://localhost");
})