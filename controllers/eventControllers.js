const fs = require("fs");

const path = "./models/events.json";

let eventData;
try {
  eventData = fs.readFileSync(path, "utf8");
  eventData = JSON.parse(eventData);
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

// Function to filter articles based on query parameters
function search(events, query) {
  return events.filter((event) => {
    const matchesEventID = query.eventId
      ? event.eventId === query.eventId
      : true;
    const matchesTitle = query.title
      ? event.title.toLowerCase().includes(query.title.toLowerCase())
      : true;
    const matchesDescription = query.description
      ? event.description.toLowerCase().includes(query.description.toLowerCase())
      : true;
      const matchesLocation =
      query.location !== undefined
        ? event.location === query.location
        : true;
        const matchesOrganizationId =
      query.organizerID !== undefined
        ? event.organizerID === query.organizerID
        : true;
    return (
      matchesEventID && matchesDescription && matchesTitle && matchesDescription && matchesLocation && matchesOrganizationId
    );
  });
}

function findEventById(eventId, res) {
  const event = eventData.find((event) => event.eventId === eventId);
  if (!event) {
    res.status(404).send("Event not found");
  } else {
    return res.json(event);
  }
}

const searchEvent = (req, res) => {
  const query = req.query;

  const filteredEvent = search(eventData, query);

  res.status(200).json({
    message: "Event fetched successfully",
    data: filteredEvent,
  });
};

const getAllEvents = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const pageSize = parseInt(req.query.pageSize) || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEvents = eventData.slice(startIndex, endIndex);

  res.json({
    page,
    pageSize,
    totalPages: Math.ceil(eventData.length / pageSize),
    totalItems: eventData.length,
    events: paginatedEvents,
  });
};

const getEventById = (req, res) => {
  const id = parseInt(req.params.id);
  findEventById(id,res)
};

const createEvent = (req, res) => {
  const { title, description, date, location, organizerID } = req.body;

  const newId =
    eventData.length > 0 ? eventData[eventData.length - 1].eventId + 1 : 1;
  const now = new Date().toISOString();



  const event = {
    eventId: newId,
    title: title,
    description: description,
    date: date,
    location: location,
    organizerID: organizerID,
  };

  // Add the new user data to the existing data array
  let existingData = [];
  existingData = eventData;
  existingData.push(event);
  if(title == null || description == null || date == null || location == null || organizerID == null){
    res.status(400).send({message: "bad request"})
  }else{
    writeDataToFile(path, existingData, res, event, 201);

  }
  
};

const updateEvent = (req, res) => {
  const eventId = parseInt(req.params.id);
  const { title, description, date, location, organizerID } = req.body;

  // Read existing data from the JSON file
  let existingData = [];
  existingData = eventData;

  // Find the event to update
  const eventIndex = eventData.findIndex((event) => event.eventId === eventId);
  if (eventIndex === -1) {
    return res.status(404).send("Event not found");
  }

  // Update the event's data only with provided fields (partial update)
  const updatedEvent = {
    ...existingData[eventIndex],
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(date !== undefined && { date }),
    ...(location !== undefined && { location }),
    ...(organizerID !== undefined && { organizerID }),
  };
  existingData[eventIndex] = updatedEvent;
  // Write the updated data back to the JSON file
  writeDataToFile(path, existingData, res, updatedEvent, 200);
};


// DELETE endpoint to update user data
const deleteEvent = (req, res) => {
  const eventId = parseInt(req.params.id);
  const eventIndex = eventData.findIndex((event) => event.eventId === eventId);
  if (eventIndex === -1) {
    return res.status(404).send("Event not found");
  }
  eventData = eventData.filter((event) => event.eventId !== eventId);
  writeDataToFile(path, eventData, res, "Event deleted successfully", 200);
};

module.exports = {
  searchEvent,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
