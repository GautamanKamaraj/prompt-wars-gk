const express = require('express');
const cors = require('cors');
// const admin = require('firebase-admin');

// // Initialize Firebase Admin with Service Account
// const serviceAccount = require('./serviceAccountKey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const app = express();
app.use(cors());
app.use(express.json());

// Serve the Solaris Web UI
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.post('/ping', async (req, res) => {
  const { recipientId, senderId } = req.body;
  console.log(`[PING] Sender ${senderId} wants to wake up Recipient ${recipientId}`);

  try {
    // 1. Fetch recipient's Expo Push Token from DB
    const pushToken = "ExponentPushToken[mock_token_here]"; // Mocked

    // 2. Formatting the FCM/Expo Push Payload to override DND
    // This requires target Android channel IDs and iOS critical flags.
    const message = {
      to: pushToken,
      sound: "default",
      title: "🚨 URGENT: WAKE UP! 🚨",
      body: "Your friend is pinging you! Wake up!",
      data: { senderId },
      // Android specific override channel
      channelId: "critical-wake-up",
      // iOS specific critical override
      _displayInForeground: true,
      categoryId: "critical",
    };

    // Sending via Expo Push API (or replace with native FCM admin API)
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const receipt = await response.json();
    console.log("[PUSH RECEIPT]", receipt);

    res.status(200).json({ success: true, message: 'High priority ping dispatched', receipt });
  } catch (error) {
    console.error("Error sending ping:", error);
    res.status(500).json({ error: error.message });
  }
});

// SPA Routing - send all other requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Solaris Awakening Unified Backend listening on port ${PORT}`);
});
