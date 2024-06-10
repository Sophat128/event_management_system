const fs = require("fs");
const path = "./models/users.json";

let userData;
try {
  userData = fs.readFileSync(path, "utf8");
  userData = JSON.parse(userData);
} catch (err) {
  console.error("Error reading file:", err);
}

// Function to filter articles based on query parameters
function search(users, query) {
  return users.filter((user) => {
    const matchesUserId = query.userId
      ? user.userId === query.userId
      : true;
      const matchesUsername = query.username
      ? user.username.toLowerCase().includes(query.username.toLowerCase())
      : true;
    
    return (
      matchesUserId && matchesUsername 
    );
  });
}

/**
 * Writes data to a JSON file and handles the Express response.
 *
 * @param {string} filePath - The path to the JSON file.
 * @param {object} data - The data to write to the file.
 * @param {object} res - The Express response object.
 */

function writeDataToFile(filePath, data, res, reqData, statusCode) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.status(statusCode).json({
      status: statusCode,
      data: reqData,
    });
  } catch (err) {
    console.error("Error writing file:", err);
    res.status(500).send("Internal Server Error");
  }
}



const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = userData.find((user) => user.userId === id);
  if (!user) {
    res.status(404).send("User not found");
  } else {
    return res.json(user);
  }
};


const searchUser = (req, res) => {
  const query = req.query;

  const filteredUser = search(userData, query);

  res.status(200).json({
    message: "User fetched successfully",
    data: filteredUser,
  });
};

const getAllUsers = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const pageSize = parseInt(req.query.pageSize) || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = userData.slice(startIndex, endIndex);

  res.json({
    page,
    pageSize,
    totalPages: Math.ceil(userData.length / pageSize),
    totalItems: userData.length,
    users: paginatedUsers,
  });
};

const createNewUser = (req, res) => {
  const { username, password } = req.body;

  const newId =
    userData.length > 0 ? userData[userData.length - 1].userId + 1 : 1;

  console.log("last data: ", userData[userData.length - 1]);

  const user = {
    userId: newId,
    username: username,
    password: password,
  };
  console.log("Data: ", user);
  // Add the new user data to the existing data array
  let existingData = [];
  existingData = userData;
  existingData.push(user);
  if (username == null || password == null) {
    res.status(400).send({ message: "bad request" });
  } else {
    writeDataToFile(path, existingData, res, user, 201);
  }
};

const updatePassword = (req, res) => {
  const { body, params } = req;
  console.log({ params });
  const id = parseInt(params.id);
  const { password } = body;
  userData.forEach((user) => {
    if (user.userId === id) {
      user.password = password;
    }
  });
  res.status(204).send();
};

const updateUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, password } = req.body;

  // Read existing data from the JSON file
  let existingData = [];
  existingData = userData;

  // Find the user to update
  const userIndex = userData.findIndex((user) => user.userId === userId);
  if (userIndex === -1) {
    return response.status(404).send("User not found");
  }
  // Update the user's data
  const updatedUser = {
    ...existingData[userIndex],
    username:
      username !== undefined ? username : existingData[userIndex].username,
    password:
      password !== undefined ? password : existingData[userIndex].password,
  };
  existingData[userIndex] = updatedUser;

  // Write the updated data back to the JSON file
  writeDataToFile(path, existingData, res, updatedUser, 200);
};

const deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = userData.findIndex((user) => user.userId === userId);
  if (userIndex === -1) {
    return response.status(404).send("User not found");
  }
  userData = userData.filter((user) => user.userId !== userId);
  writeDataToFile(path, userData, res, "User deleted successfully", 200);
};

module.exports = {
  getUserById,
  searchUser,
  getAllUsers,
  createNewUser,
  updatePassword,
  updateUser,
  deleteUser,
};
