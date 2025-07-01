// ✅ Requirements
const fs = require('fs');
const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

// ✅ Firebase Upload Function
const uploadToFirebase = async (base64String, fileName) => {
  const buffer = Buffer.from(base64String, 'base64');

  const firebaseURL = `https://firebasestorage.googleapis.com/v0/b/YOUR_BUCKET_NAME/o/${fileName}.mp3?uploadType=media`;
  const headers = {
    'Content-Type': 'audio/mpeg',
    'Authorization': 'Bearer YOUR_FIREBASE_TOKEN'
  };

  try {
    await axios.put(firebaseURL, buffer, { headers });
    return `https://firebasestorage.googleapis.com/v0/b/YOUR_BUCKET_NAME/o/${fileName}.mp3?alt=media`;
  } catch (err) {
    console.error("Upload failed:", err.message);
    return null;
  }
};

// ✅ API Route to Receive Base64 from Make.com
app.post('/upload-mp3', async (req, res) => {
  const { audioBase64, fileName } = req.body;
  const publicUrl = await uploadToFirebase(audioBase64, fileName);
  if (publicUrl) {
    res.json({ status: 'success', url: publicUrl });
  } else {
    res.status(500).json({ status: 'error', message: 'Upload failed' });
  }
});

// ✅ Start server
app.listen(3000, () => console.log('Uploader ready on port 3000'));
