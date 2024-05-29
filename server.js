const dotenv = require("dotenv");
dotenv.config()

const express = require("express");
const userRoutes = require("./routers/userRoutes");
const morgan = require("morgan");
const app = express();

app.use(morgan("common"))
app.set("view engine", 'ejs')
app.use(express.json())
app.use("/assets", express.static("public"))
app.use("",userRoutes)
app.get("/", (req, res) => {
  const style = "stylesheet"
  res.send("<link rel='"+ style +"' href='/assets/css/styles.css'><h1 style='color: red'><img src='/assets/img/promise.webp'>NodeJS Project</h1>")
})

app.listen(process.env.PORT, ()=> {
  console.log("Server is running on http://localhost");
})