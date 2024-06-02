const fs = require("fs");

const path = "./models/tickets.json";

let ticketData;
try {
  ticketData = fs.readFileSync(path, "utf8");
  ticketData = JSON.parse(ticketData);
} catch (err) {
  console.error("Error reading file:", err);
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


function findTicketById(ticketId, res) {
  const ticket = ticketData.find((ticket) => ticket.ticketId === ticketId);
  if (!ticket) {
    res.status(404).send("User not found");
  } else {
    return res.json(ticket);
  }
}


const getAllTickets = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const pageSize = parseInt(req.query.pageSize) || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTickets = ticketData.slice(startIndex, endIndex);

  res.json({
    page,
    pageSize,
    totalPages: Math.ceil(ticketData.length / pageSize),
    totalItems: ticketData.length,
    tickets: paginatedTickets,
  });
};

const getTicketById = (req, res) => {
  const id = parseInt(req.params.id);
  findTicketById(id, res);
};

const createTicket = (req, res) => {
  const { eventId, ticketType, purchaseDate } = req.body;

  const newId =
    ticketData.length > 0 ? ticketData[ticketData.length - 1].id + 1 : 1;
  const now = new Date().toISOString();

  console.log("last data: ", ticketData[ticketData.length - 1]);

  const ticket = {
    ticketId: newId,
    eventId: eventId,
    ticketType: ticketType,
    purchaseDate: purchaseDate,
  };
  console.log("Data: ", ticket);
  // Add the new user data to the existing data array
  let existingData = [];
  existingData = ticketData;
  existingData.push(ticket);

  writeDataToFile(path, existingData, res, ticket, 201);
};

// PUT endpoint to update user data
const updateTicket = (req, res) => {
  const ticketId = parseInt(req.params.id);
  const { eventId, ticketType, purchaseDate } = req.body;

  // Read existing data from the JSON file
  let existingData = [];
  existingData = ticketData;

  // Find the user to update
  const ticketIndex = ticketData.findIndex((ticket) => ticket.id === ticketId);
  if (ticketIndex === -1) {
    return res.status(404).send("User not found");
  }

  // Update the user's data
  const updatedTicket = {
    ...existingData[ticketIndex],
    eventId:
      eventId !== undefined ? eventId : existingData[ticketIndex].eventId,
    ticketType:
      ticketType !== undefined
        ? ticketType
        : existingData[ticketIndex].ticketType,
    purchaseDate:
      purchaseDate !== undefined
        ? purchaseDate
        : existingData[ticketIndex].purchaseDate,
  };
  existingData[ticketIndex] = updatedTicket;

  // Write the updated data back to the JSON file
  writeDataToFile(path, existingData, res, updatedTicket, 200);
};

// DELETE endpoint to update user data
const deleteTicket = (req, res) => {
  const ticketId = parseInt(req.params.id);
  const ticketIndex = ticketData.findIndex((event) => event.id === ticketId);
  if (ticketIndex === -1) {
    return res.status(404).send("Event not found");
  }
  ticketData = ticketData.filter((event) => event.id !== ticketId);
  writeDataToFile(path, ticketData, res, "Event deleted successfully", 200);
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};
