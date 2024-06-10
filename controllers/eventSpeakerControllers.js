const fs = require("fs");

const path = "./models/eventspeakers.json";

let eventspeakersData;
try {
  eventspeakersData = fs.readFileSync(path, "utf8");
  eventspeakersData = JSON.parse(eventspeakersData);
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


function findEventspeakersById(eventspeakersId, res) {
  const eventspeakers = eventspeakersData.find((eventspeakers) => eventspeakers.eventspeakersId === eventspeakersId);
  if (!eventspeakers) {
    res.status(404).send("Eventspeakers not found");
  } else {
    return res.json(eventspeakers);
  }
}


const getAllSpeakers = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const pageSize = parseInt(req.query.pageSize) || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEventspeakers = eventspeakersData.slice(startIndex, endIndex);

  res.json({
    page,
    pageSize,
    totalPages: Math.ceil(eventspeakersData.length / pageSize),
    totalItems: eventspeakersData.length,
    eventspeakers : paginatedEventspeakers,
  });
};

const getEventspeakersById = (req, res) => {
  const id = parseInt(req.params.id);
  findEventspeakersById(id, res);
};

const createEventspeakers = (req, res) => {
  const { eventId,speakersId } = req.body;
  
  const newId =
  eventspeakersData.length > 0 ? eventspeakersData[eventspeakersData.length - 1].eventId + 1 : 1;
  const now = new Date().toISOString();

  const eventSpeakers = {
    eventId: newId,
    speakersId: speakersId,
  };
  

  // Add the new Event data to the existing data array
  let existingData = [];
  existingData = eventspeakersData;
  existingData.push(eventSpeakers);
  if(firstName == null || lastName == null || phoneNumber == null || bio == null){
    res.status(400).send({message: "Bad request"})
  }else{
    writeDataToFile(path, existingData, res, eventspeakers, 201);
  }
};




// DELETE endpoint to update Event data
const deleteeventspeakers = (req, res) => {
  const eventspeakersId = parseInt(req.params.id);
  const eventspeakersIndex = eventspeakersData.findIndex((event) => event.eventspeakersId === eventspeakersId);
  if (eventspeakersIndex === -1) {
    return res.status(404).send("Event not found");
  }
  eventspeakersData = eventspeakersData.filter((event) => event.speakersIdId !== eventspeakersId);
  writeDataToFile(path, eventspeakersData, res, "Eventspeakers deleted successfully", 200);
};

module.exports = {
  getAllSpeakers,
  getEventspeakersById,
  createEventspeakers,
  deleteeventspeakers,
};