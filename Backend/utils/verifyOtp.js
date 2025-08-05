exports.verifyOtp = async (req, res) => {
  const { phone, code } = req.body;

  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: phone, code });

    if (verificationCheck.status === "approved") {
      res.status(200).json({ message: "User verified!" });
    } else {
      res.status(400).json({ message: "Incorrect code" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
