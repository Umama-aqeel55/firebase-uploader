import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json({ limit: '20mb' }));

const SUPABASE_URL = 'https://qqxyuixxvkmxowvgdafh.supabase.co';
const SUPABASE_BUCKET = 'voices';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxeHl1aXh4dmtteG93dmdkYWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTEwMjksImV4cCI6MjA2NjkyNzAyOX0.aAGbKS7tH1Yp9RaRZiuJfNcegoed9PiDeOUuSQ7gC_w'; // your anon key is fine if bucket is public

app.post('/upload-mp3', async (req, res) => {
  try {
    const { audioBase64, fileName } = req.body;

    if (!audioBase64 || !fileName) {
      return res.status(400).json({ error: 'Missing audioBase64 or fileName' });
    }

    // Clean Base64
    const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${fileName}`;

    const { data } = await axios.post(uploadUrl, buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Authorization': `Bearer ${SUPABASE_API_KEY}`,
        'x-upsert': 'true'
      }
    });

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${fileName}`;

    return res.status(200).json({
      status: 'success',
      url: publicUrl,
    });

  } catch (err) {
    console.error('Upload error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
