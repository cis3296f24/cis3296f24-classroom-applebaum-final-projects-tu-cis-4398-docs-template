const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');

// Initialize dotenv to load .env file
dotenv.config();

// Set up OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use the key from .env
});

// Set up Express app
const app = express();
app.use(express.json());  // Express already has JSON parsing built-in
app.use(cors());

// Endpoint to interact with OpenAI
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body; // Get the prompt from the request body

  if (!prompt) {
    return res.status(400).send('Prompt is required');
  }

  try {
    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use a more updated model like gpt-3.5-turbo
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    // Return the response text from OpenAI
    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).send('Error with OpenAI request');
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
