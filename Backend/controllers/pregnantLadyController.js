const AshaWorker = require("../models/ashaworker");
const PregnantLady = require("../models/pregnantlady");

const getNearbyAshaWorkers = async (req, res) => {
  try {
    const { pregnantLadyId } = req.params;

    const lady = await PregnantLady.findById(pregnantLadyId);

    if (!lady) {
      return res.status(404).json({ error: "Pregnant lady not found" });
    }

    if (!lady.location) {
      console.error("Missing location field.");
      return res.status(400).json({ error: "Location field is missing" });
    }

    if (!Array.isArray(lady.location.coordinates)) {
      console.error("Coordinates are not an array:", lady.location.coordinates);
      return res.status(400).json({ error: "Coordinates must be an array" });
    }

    if (lady.location.coordinates.length !== 2) {
      console.error("Coordinates length invalid:", lady.location.coordinates);
      return res.status(400).json({ error: "Latitude and Longitude required" });
    }

    const [longitude, latitude] = lady.location.coordinates;

    const nearby = await AshaWorker.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000, // 10 km
        },
      },
    });

    return res.json({ ashaWorkers: nearby });
  } catch (err) {
    console.error("Error fetching nearby ASHA workers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getNearbyAshaWorkers,
};
