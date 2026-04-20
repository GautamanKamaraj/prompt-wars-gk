const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Serve the Solaris Web UI
app.use(express.static(path.join(__dirname, 'public')));

app.post('/ping', async (req, res) => {
  const { recipientId, senderId } = req.body;

  if (!recipientId || !senderId || typeof recipientId !== 'string' || typeof senderId !== 'string') {
    return res.status(400).json({ error: 'recipientId and senderId are required strings' });
  }

  console.log(`[PING] Sender ${senderId} wants to wake up Recipient ${recipientId}`);

  try {
    // 1. Fetch recipient's Expo Push Token from DB
    const pushToken = "ExponentPushToken[mock_token_here]"; // Mocked

    // 2. Formatting the FCM/Expo Push Payload to override DND
    const message = {
      to: pushToken,
      sound: "default",
      title: "🚨 URGENT: WAKE UP! 🚨",
      body: "Your friend is pinging you! Wake up!",
      data: { senderId },
      channelId: "critical-wake-up",
      _displayInForeground: true,
      categoryId: "critical",
    };

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
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('Solaris Awakening is Live (Static files missing - check backend/public)');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Solaris Awakening Unified Backend listening on port ${PORT}`);
});
