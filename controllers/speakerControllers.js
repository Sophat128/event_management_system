const fs = require("fs");

const path = "./models/speaker.json";

let speakerData;
try {
  speakerData = fs.readFileSync(path, "utf8");
  speakerData = JSON.parse(speakerData);
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


function findSpeakerById(speakerId, res) {
  const speaker = speakerData.find((speaker) => speaker.speakerId === speakerId);
  if (!speaker) {
    res.status(404).send("Speaker not found");
  } else {
    return res.json(speaker);
  }
}


const getAllSpeakers = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const pageSize = parseInt(req.query.pageSize) || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSpeakers = speakerData.slice(startIndex, endIndex);

  res.json({
    page,
    pageSize,
    totalPages: Math.ceil(speakerData.length / pageSize),
    totalItems: speakerData.length,
    speakers: paginatedSpeakers,
  });
};

const getSpeakerById = (req, res) => {
  const id = parseInt(req.params.id);
  findSpeakerById(id, res);
};

const createSpeaker = (req, res) => {
  const { speakerId, nameType, bioType } = req.body;
  
  const newId =
    speakerData.length > 0 ? speakerData[speakerData.length - 1].speakerId + 1 : 1;
  const now = new Date().toISOString();

  const speaker = {
    speakerId: newId,
    nameType: nameType,
    bioType: bioType,
  };
  // Add the new user data to the existing data array
  let existingData = [];
  existingData = speakerData;
  existingData.push(speaker);

  writeDataToFile(path, existingData, res, speaker, 201);
};

