const fs = require("fs");

const path = "./models/tickets.json";

let ticketData;
try {
  ticketData = fs.readFileSync(path, "utf8");
  ticketData = JSON.parse(ticketData);
} catch (err) {
  console.error("Error reading file:", err);
}


// Function to filter articles based on query parameters
function search(tickets, query) {
  return tickets.filter((ticket) => {
    const matchesTicketId = query.ticketId
      ? ticket.ticketId === query.ticketId
      : true;
    const matchesEventId =
      query.eventId !== undefined
        ? article.eventId === query.eventId 
        : true;
        const matchesTicketType =
        query.ticketType !== undefined
          ? ticket.ticketType === query.ticketType 
          : true;
          const matchesPurchaseDate =
          query.purchaseDate !== undefined
            ? ticket.purchaseDate === query.purchaseDate 
            : true;
    
    return (
      matchesTicketId && matchesEventId && matchesTicketType && matchesPurchaseDate
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

function findTicketById(ticketId, res) {
  const ticket = ticketData.find((ticket) => ticket.ticketId === ticketId);
  if (!ticket) {
    res.status(404).send("Ticket not found");
  } else {
    return res.json(ticket);
  }
}

const searchTicket = (req, res) => {
  const query = req.query;

  const filteredTicket = search(ticketData, query);

  res.status(200).json({
    message: "Ticket fetched successfully",
    data: filteredTicket,
  });
};

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
  const { eventId, userId, ticketType, purchaseDate } = req.body;
  
  const newId =
    ticketData.length > 0 ? ticketData[ticketData.length - 1].ticketId + 1 : 1;
  const now = new Date().toISOString();

  const ticket = {
    ticketId: newId,
    userId: userId,
    eventId: eventId,
    ticketType: ticketType,
    purchaseDate: purchaseDate,
  };
  // Add the new user data to the existing data array
  let existingData = [];
  existingData = ticketData;
  existingData.push(ticket);
  if(userId == null || eventId == null || ticketType == null || purchaseDate == null){
    res.status(400).send({message: "bad request"})
  }else{
    writeDataToFile(path, existingData, res, ticket, 201);
  }
};



const updateTicket = (req, res) => {
  const ticketId = parseInt(req.params.id);
  const { eventId, userId, ticketType, purchaseDate } = req.body;

  // Read existing data from the JSON file
  let existingData = ticketData;

  // Find the ticket to update
  const ticketIndex = ticketData.findIndex((ticket) => ticket.ticketId === ticketId);
  if (ticketIndex === -1) {
    return res.status(404).send("Ticket not found");
  }

  // Update the ticket's data only with provided fields (partial update)
  const updatedTicket = {
    ...existingData[ticketIndex],
    ...(eventId !== undefined && { eventId }),
    ...(userId !== undefined && { userId }),
    ...(ticketType !== undefined && { ticketType }),
    ...(purchaseDate !== undefined && { purchaseDate }),
  };
  existingData[ticketIndex] = updatedTicket;

  // Write the updated data back to the JSON file
  writeDataToFile(path, existingData, res, updatedTicket, 200);
};


// DELETE endpoint to update user data
const deleteTicket = (req, res) => {
  const ticketId = parseInt(req.params.id);
  const ticketIndex = ticketData.findIndex((event) => event.ticketId === ticketId);
  if (ticketIndex === -1) {
    return res.status(404).send("Ticket not found");
  }
  ticketData = ticketData.filter((event) => event.ticketId !== ticketId);
  writeDataToFile(path, ticketData, res, "Ticket deleted successfully", 200);
};

module.exports = {
  searchTicket,
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};
