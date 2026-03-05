require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Ithikaf SMS backend running" });
});

app.post("/send-sms", async (req, res) => {

  try {

    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        error: "Phone and message required"
      });
    }

    const response = await axios.post(
      "https://app.text.lk/api/v3/sms/send",
      {
        recipient: phone,
        sender_id: process.env.SENDER_ID,
        type: "plain",
        message: message
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TEXTLK_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {

    console.error("SMS ERROR:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });

  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});