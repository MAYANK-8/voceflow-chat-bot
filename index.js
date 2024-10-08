const express = require('express');
const multer = require('multer');  // For handling file uploads
const { v4: uuidv4 } = require('uuid');
const pinecone = require('pinecone-client');  // For storing image vectors in Pinecone
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });  // Set up image upload destination

// Initialize Pinecone (Replace with your Pinecone API key and environment)
const pineconeClient = new pinecone.Client();
pineconeClient.init({
  apiKey: '439b4494-fec2-4deb-ba7c-bb2327d55e4d',  // Replace with your Pinecone API key
  environment: 'us-east-1'  // Replace with your environment (e.g., us-east1, europe-west1)
});

const index = pineconeClient.Index("garbage-bot-index");  // Your Pinecone index name

// Route to handle photo upload
app.post('/upload', upload.single('image'), async (req, res) => {
    const uniqueId = uuidv4();  // Generate unique ID for tracking
    const imagePath = req.file.path;  // Path to the uploaded image

    try {
        // Process image into a vector (implement processImage based on the model you use)
        const imageVector = await processImage(imagePath);

        // Store the image vector and unique ID in Pinecone
        await index.upsert([{
            id: uniqueId,
            vector: imageVector,
            metadata: {
                userId: req.body.userId || 'anonymous'  // Optional user metadata (replace as needed)
            }
        }]);

        // Respond with the unique query ID
        res.json({ success: true, queryId: uniqueId });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ success: false, message: 'Error processing image' });
    }
});

// Function to process image into a vector (example placeholder)
async function processImage(imagePath) {
    // Use CLIP, TensorFlow, or any other method to convert the image into a vector
    // This is a placeholder and should be replaced with your actual image processing logic.
    // For example, using CLIP model or another image-to-vector transformation.

    // Placeholder vector, replace this with real image vector processing
    return [0.1, 0.2, 0.3, 0.4, 0.5];  // Example of a random vector
}

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
