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
// function filter(articles, query) {
//   return articles.filter((article) => {
//     const matchesCreatedBy = query.created_by
//       ? article.created_by === query.created_by
//       : true;
//     const matchesIsPublished =
//       query.is_published !== undefined
//         ? article.is_published === (query.is_published === "true")
//         : true;
//     const matchesTitle = query.title
//       ? article.title.toLowerCase().includes(query.title.toLowerCase())
//       : true;
//     const matchesContent = query.contents
//       ? article.contents.toLowerCase().includes(query.contents.toLowerCase())
//       : true;
//     return (
//       matchesCreatedBy && matchesIsPublished && matchesTitle && matchesContent
//     );
//   });
// }

function findEventById(eventId, res) {
  const event = eventData.find((event) => event.eventId === eventId);
  if (!event) {
    res.status(404).send("User not found");
  } else {
    return res.json(event);
  }
}

// const filterArticles = (req, res) => {
//   const query = req.query;

//   const filteredArticles = filter(eventData, query);

//   res.status(200).json({
//     message: "Articles fetched successfully",
//     data: filteredArticles,
//   });
// };

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
    eventData.length > 0 ? eventData[eventData.length - 1].id + 1 : 1;
  const now = new Date().toISOString();

  console.log("last data: ", eventData[eventData.length - 1]);

  const event = {
    eventId: newId,
    title: title,
    description: description,
    date: date,
    location: location,
    organizerID: organizerID,
  };
  console.log("Data: ", event);
  // Add the new user data to the existing data array
  let existingData = [];
  existingData = eventData;
  existingData.push(event);

  writeDataToFile(path, existingData, res, event, 201);
};

// PUT endpoint to update user data
const updateEvent = (req, res) => {
  const eventId = parseInt(req.params.id);
  const { title, description, date, location, organizerID } = req.body;

  // Read existing data from the JSON file
  let existingData = [];
  existingData = eventData;

  // Find the user to update
  const eventIndex = eventData.findIndex((event) => event.id === eventId);
  if (eventIndex === -1) {
    return res.status(404).send("User not found");
  }

  // Update the user's data
  const updatedEvent = {
    ...existingData[eventIndex],
    title: title !== undefined ? title : existingData[eventIndex].title,
    description:
      description !== undefined
        ? description
        : existingData[eventIndex].description,
    date: date !== undefined ? date : existingData[eventIndex].date,
    location:
      location !== undefined ? location : existingData[eventIndex].location,
    organizerID:
      organizerID !== undefined
        ? organizerID
        : existingData[eventIndex].organizerID,
  };
  existingData[eventIndex] = updatedEvent;

  // Write the updated data back to the JSON file
  writeDataToFile(path, existingData, res, updatedEvent, 200);
};

// DELETE endpoint to update user data
const deleteEvent = (req, res) => {
  const eventId = parseInt(req.params.id);
  const eventIndex = eventData.findIndex((event) => event.id === eventId);
  if (eventIndex === -1) {
    return res.status(404).send("Event not found");
  }
  eventData = eventData.filter((event) => event.id !== eventId);
  writeDataToFile(path, eventData, res, "Event deleted successfully", 200);
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
