const userData = require("../models/users.json")

const getAllUser = (req, res) => {
  // const {query} = req;
  // if(query.username) {
  //   res.send(userData.filter(u=> u.username == query.username))
  // } else{
  //   res.send(userData);
  // }
  
  res.render("users.ejs", { app_name: "Web ORM 2"})
}

const createNewUser = (request, response) => {
  const body = request.body;
  console.log({ body })
  const { username, password } = body;
  userData.push({ id: userData.length+1, username: username, password})
  response.status(201).send("Success Created")
}
const updatePassword = (req, res) => {
  const {body, params} = req;
  console.log({params})
  const id = parseInt(params.id)
  const {password} = body;
  userData.forEach(user => {
    if(user.id === id){
      user.password = password
    }
  });
  res.status(204).send();

}
module.exports = {
  getAllUser,
  createNewUser,
  updatePassword
}