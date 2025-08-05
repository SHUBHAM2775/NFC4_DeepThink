const PregnantLady = require("../models/pregnantlady");

const getHighRiskPregnantLadiesCount = async (req, res) => {
  try {
    const count = await PregnantLady.countDocuments({ status: "High" });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching high-risk count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getHighRiskPregnantLadiesCount,
};
