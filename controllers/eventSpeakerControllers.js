const fs = require("fs");

const path = "./models/eventSpeakers.json";

let eventSpeakerData;
try {
  eventSpeakerData = fs.readFileSync(path, "utf8");
  eventSpeakerData = JSON.parse(eventSpeakerData);
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


function findEventSpeakerById(eventSpeakerId, res) {
  const eventSpeaker = eventSpeakerData.find((eventSpeaker) => eventSpeaker.eventSpeakerId === eventSpeakerId);
  if (!eventSpeaker) {
    res.status(404).send("Event speaker not found");
  } else {
    return res.json(eventSpeaker);
  }
}


const getAllSpeakers = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const pageSize = parseInt(req.query.pageSize) || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEventSpeakers = eventSpeakerData.slice(startIndex, endIndex);

  res.json({
    page,
    pageSize,
    totalPages: Math.ceil(eventSpeakerData.length / pageSize),
    totalItems: eventSpeakerData.length,
    eventSpeakers : paginatedEventSpeakers,
  });
};

const getEventSpeakersById = (req, res) => {
  const id = parseInt(req.params.id);
  findEventSpeakerById(id, res);
};

const createEventSpeaker = (req, res) => {
  const { eventId,speakerId } = req.body;
  const newId =
  eventSpeakerData.length > 0 ? eventSpeakerData[eventSpeakerData.length - 1].eventSpeakerId + 1 : 1;
  const eventSpeakers = {
    eventSpeakerId: newId,
    eventId: eventId,
    speakerId: speakerId,
  };
  
  // Add the new Event data to the existing data array
  let existingData = [];
  existingData = eventSpeakerData;
  existingData.push(eventSpeakers);
  if(eventId == null || speakerId == null){
    res.status(400).send({message: "Bad request"})
  }else{
    writeDataToFile(path, existingData, res, eventSpeakers, 201);
  }
};

const updateEventSpeaker = (req, res) => {
  const eventSpeakerId = parseInt(req.params.id);
  const { eventId, speakerId } = req.body;

  // Read existing data from the JSON file
  let existingData = eventSpeakerData;

  // Find the ticket to update
  const eventSpeakerIndex = eventSpeakerData.findIndex((eventSpeaker) => eventSpeaker.eventSpeakerId === eventSpeakerId);
  if (eventSpeakerIndex === -1) {
    return res.status(404).send("Ticket not found");
  }

  // Update the ticket's data only with provided fields (partial update)
  const updatedEventSpeaker = {
    ...existingData[eventSpeakerIndex],
    ...(eventId !== undefined && { eventId }),
    ...(speakerId !== undefined && { speakerId })
  };
  existingData[eventSpeakerIndex] = updatedEventSpeaker;

  // Write the updated data back to the JSON file
  writeDataToFile(path, existingData, res, updatedEventSpeaker, 200);
};

// DELETE endpoint to update Event data
const deleteEventSpeaker = (req, res) => {
  const eventSpeakerId = parseInt(req.params.id);
  const eventSpeakerIndex = eventSpeakerData.findIndex((event) => event.eventSpeakerId === eventSpeakerId);
  if (eventSpeakerIndex === -1) {
    return res.status(404).send("Event not found");
  }
  eventSpeakerData = eventSpeakerData.filter((event) => event.speakersIdId !== eventSpeakerId);
  writeDataToFile(path, eventSpeakerData, res, "Event speaker deleted successfully", 200);
};

module.exports = {
  getAllSpeakers,
   getEventSpeakersById,
   createEventSpeaker,
   updateEventSpeaker,
   deleteEventSpeaker,
};