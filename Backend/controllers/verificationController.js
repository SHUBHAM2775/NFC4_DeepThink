const AshaWorker = require("../models/ashaworker");
const path = require("path");
const fs = require("fs");

const getPendingVerifications = async (req, res) => {
  try {
    const pendingWorkers = await AshaWorker.find({
      verificationStatus: "pending",
    }).select("name phoneNumber documents village district state ashaId");

    res.status(200).json({
      message: "Pending verifications fetched successfully",
      count: pendingWorkers.length,
      data: pendingWorkers,
    });
  } catch (err) {
    console.error("Error in getPendingVerifications:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateVerificationStatus = async (req, res) => {
  try {
    const { ashaId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be 'pending', 'approved', or 'rejected'",
      });
    }

    const updatedWorker = await AshaWorker.findOneAndUpdate(
      { ashaId },
      { verificationStatus: status },
      { new: true }
    ).select("ashaId name phoneNumber verificationStatus");

    if (!updatedWorker) {
      return res.status(404).json({ error: "ASHA Worker not found" });
    }

    res.status(200).json({
      message: `Verification status updated to '${status}' successfully`,
      data: updatedWorker,
    });
  } catch (err) {
    console.error("Error in updateVerificationStatus:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPendingAshaWorkersCount = async (req, res) => {
  try {
    const totalPending = await AshaWorker.countDocuments({
      verificationStatus: "pending",
    });

    res.status(200).json({
      message: "Total pending ASHA workers count fetched successfully",
      totalPending,
    });
  } catch (err) {
    console.error("Error in getPendingAshaWorkersCount:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getVerifiedAshaWorkersCount = async (req, res) => {
  try {
    const totalVerified = await AshaWorker.countDocuments({
      verificationStatus: "approved",
    });

    res.status(200).json({
      message: "Total verified ASHA workers count fetched successfully",
      totalVerified,
    });
  } catch (err) {
    console.error("Error in getVerifiedAshaWorkersCount:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAshaWorkerDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    const ashaWorker = await AshaWorker.findOne({ ashaId: id }, "documents");

    if (!ashaWorker) {
      return res.status(404).json({ error: "AshaWorker not found" });
    }

    res.status(200).json({ documents: ashaWorker.documents });
  } catch (err) {
    console.error("Error in getAshaWorkerDocuments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const serveDocument = async (req, res) => {
  try {
    const { ashaId, filename } = req.params;

    // Verify that the ASHA worker exists and has this document
    const ashaWorker = await AshaWorker.findOne({ ashaId }, "documents");
    
    if (!ashaWorker) {
      return res.status(404).json({ error: "ASHA Worker not found" });
    }

    if (!ashaWorker.documents.includes(filename)) {
      return res.status(404).json({ error: "Document not found for this ASHA worker" });
    }

    // Construct the file path (assuming documents are stored in uploads/asha-documents/{ashaId}/)
    const uploadsDir = path.join(__dirname, "../uploads/asha-documents", ashaId);
    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Document file not found on server" });
    }

    // Set appropriate headers based on file type
    const ext = path.extname(filename).toLowerCase();
    const contentType = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif'
    }[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (err) {
    console.error("Error in serveDocument:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getPendingVerifications,
  updateVerificationStatus,
  getPendingAshaWorkersCount,
  getVerifiedAshaWorkersCount,
  getAshaWorkerDocuments,
  serveDocument,
};
