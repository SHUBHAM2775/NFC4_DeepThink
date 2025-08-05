const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOtp = async (phone, otp) => {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: phone, channel: "sms" });

    return verification;
  } catch (error) {
    throw error;
  }
};

module.exports = sendOtp;
