const fs = require("fs");
const path = require("path");
const profilePath = "./models/profiles.json";
;
let profileData;

try {
    profileData = fs.readFileSync(profilePath, "utf8");
    profileData = JSON.parse(profileData);
} catch (err) {
    console.error("Error reading file:", err);
    profileData = [];
}

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

function findProfileById(profileId, res) {
    const profile = profileData.find((profile) => profile.profileId === profileId);
    if (!profile) {
        return res.status(404).send("Profile not found");
    } else {
        return res.json(profile);
    }
}

const getAllProfiles = (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const pageSize = parseInt(req.query.pageSize) || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProfiles = profileData.slice(startIndex, endIndex);

    res.json({
        page,
        pageSize,
        totalPages: Math.ceil(profileData.length / pageSize),
        totalItems: profileData.length,
        profiles: paginatedProfiles,
    });
};

const getProfileById = (req, res) => {
    const id = parseInt(req.params.id);
    findProfileById(id, res);
};

const createProfile = (req, res) => {
    const { userId, firstName, lastName, phoneNumber, bio } = req.body;

    const newId = profileData.length > 0 ? profileData[profileData.length - 1].profileId + 1 : 1;

    const profile = {
        profileId: newId,
        userId,
        firstName,
        lastName,
        phoneNumber,
        bio,
    };

    profileData.push(profile);

    writeDataToFile(profilePath, profileData, res, profile, 201);
};

const updateProfile = (req, res) => {
    const profileId = parseInt(req.params.id);
    const { userId, firstName, lastName, phoneNumber, bio } = req.body;

    const profileIndex = profileData.findIndex((profile) => profile.profileId === profileId);
    if (profileIndex === -1) {
        return res.status(404).send("Profile not found");
    }

    const updatedProfile = {
        ...profileData[profileIndex],
        userId: userId !== undefined ? userId : profileData[profileIndex].userId,
        firstName: firstName !== undefined ? firstName : profileData[profileData[profileIndex].firstName],
        lastName: lastName !== undefined ? lastName : profileData[profileData[profileIndex].lastName],
        phoneNumber: phoneNumber !== undefined ? phoneNumber : profileData[profileIndex].phoneNumber,
        bio: bio !== undefined ? bio : profileData[profileIndex].bio,
    };

    profileData[profileIndex] = updatedProfile;

    writeDataToFile(profilePath, profileData, res, updatedProfile, 200);
};

const deleteProfile = (req, res) => {
    const profileId = parseInt(req.params.id);
    const profileIndex = profileData.findIndex((profile) => profile.profileId === profileId);
    if (profileIndex === -1) {
        return res.status(404).send("Profile not found");
    }

    profileData = profileData.filter((profile) => profile.profileId !== profileId);
    writeDataToFile(profilePath, profileData, res, "Profile deleted successfully", 200);
};

module.exports = {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
};
