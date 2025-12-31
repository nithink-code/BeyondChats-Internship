const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const articleRoutes = require('./routes/articleRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/articles', articleRoutes);

app.get('/', (req, res) => {
    res.send('BeyondChats Blog Scraper API is running');
});

// Database Connection
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // Only start the server if this file is run directly
        if (require.main === module) {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

module.exports = app;
