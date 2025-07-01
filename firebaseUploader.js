import express from 'express';
import axios from 'axios';

const uploadToSupabase = async (base64Audio, filename) => {
  const buffer = Buffer.from(base64Audio, 'base64');

  const res = await axios.put(
    `https://qqxyuixxvkmxowvgdafh.supabase.co/storage/v1/object/public/voices/${filename}.mp3`,
    buffer,
    {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxeHl1aXh4dmtteG93dmdkYWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTEwMjksImV4cCI6MjA2NjkyNzAyOX0.aAGbKS7tH1Yp9RaRZiuJfNcegoed9PiDeOUuSQ7gC_w'
      }
    }
  );

  console.log("✅ Uploaded!");
  return `https://qqxyuixxvkmxowvgdafh.supabase.co/storage/v1/object/public/voices/${filename}.mp3`;
};
