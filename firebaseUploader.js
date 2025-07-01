import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json({ limit: '10mb' }));


const SUPABASE_URL = 'https://qqxyuixxvkmxowvgdafh.supabase.co';
const SUPABASE_BUCKET = 'voices';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxeHl1aXh4dmtteG93dmdkYWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTEwMjksImV4cCI6MjA2NjkyNzAyOX0.aAGbKS7tH1Yp9RaRZiuJfNcegoed9PiDeOUuSQ7gC_w';

app.post('/upload-mp3', async (req, res) => {
  try {
    const { audioBase64, fileName } = req.body;

    if (!audioBase64 || !fileName) {
      return res.status(400).json({ error: 'Missing audioBase64 or fileName' });
    }

    const buffer = Buffer.from(audioBase64, 'base64');

    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${fileName}.mp3`;

    await axios.put(uploadUrl, buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
      },
    });

    return res.json({
      status: 'success',
      url: uploadUrl,
    });
  } catch (err) {
    console.error('Upload error:', err.message);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
