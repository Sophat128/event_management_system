const fs = require("fs");
const path = "./models/speakers.json";

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
 * @param {object} reqData - The request data to include in the response.
 * @param {number} statusCode - The HTTP status code to send in the response.
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

function search(speakers, query) {
  return speakers.filter((speaker) => {
    const matchesSpeakerID = query.speakerID
      ? speaker.speakerId === parseInt(query.speakerID)
      : true;
    const matchesName = query.name
      ? speaker.name.toLowerCase().includes(query.name.toLowerCase())
      : true;
    const matchesBio = query.bio
      ? speaker.bio.toLowerCase().includes(query.bio.toLowerCase())
      : true;
    return matchesSpeakerID && matchesName && matchesBio;
  });
}

function findSpeakerById(speakerId, res) {
  const speaker = speakerData.find((speaker) => speaker.speakerId === speakerId);
  if (!speaker) {
    res.status(404).send("Speaker not found");
  } else {
    return res.json(speaker);
  }
}

const searchSpeaker = (req, res) => {
  const query = req.query;
  const filteredSpeaker = search(speakerData, query);
  res.status(200).json({
    message: "Speaker fetched successfully",
    data: filteredSpeaker,
  });
};

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
  const { name, bio } = req.body;
  if (!name || !bio) {
    return res.status(400).send({ message: "Bad request" });
  }

  const newId =
    speakerData.length > 0 ? speakerData[speakerData.length - 1].speakerId + 1 : 1;

  const speaker = {
    speakerId: newId,
    name: name,
    bio: bio,
  };

  speakerData.push(speaker);
  writeDataToFile(path, speakerData, res, speaker, 201);
};

const updateSpeaker = (req, res) => {
  const speakerId = parseInt(req.params.id);
  const { name, bio } = req.body;

  const speakerIndex = speakerData.findIndex((speaker) => speaker.speakerId === speakerId);
  if (speakerIndex === -1) {
    return res.status(404).send("Speaker not found");
  }

  const updatedSpeaker = {
    ...speakerData[speakerIndex],
    ...(name !== undefined && { name }),
    ...(bio !== undefined && { bio })
  };
  speakerData[speakerIndex] = updatedSpeaker;

  writeDataToFile(path, speakerData, res, updatedSpeaker, 200);
};

const deleteSpeaker = (req, res) => {
  const speakerId = parseInt(req.params.id);
  const speakerIndex = speakerData.findIndex((speaker) => speaker.speakerId === speakerId);
  if (speakerIndex === -1) {
    return res.status(404).send("Speaker not found");
  }
  speakerData = speakerData.filter((speaker) => speaker.speakerId !== speakerId);
  writeDataToFile(path, speakerData, res, "Speaker deleted successfully", 200);
};

module.exports = {
  searchSpeaker,
  getAllSpeakers,
  getSpeakerById,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
};
