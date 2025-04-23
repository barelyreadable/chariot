// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const rateLimit = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/drivers');
const eventRoutes = require('./routes/events');
const riderRoutes = require('./routes/riders');
const carpoolRoutes = require('./routes/carpools');

const { verifyToken } = require('./middleware/auth');

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(rateLimit);
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', verifyToken, driverRoutes);
app.use('/api/events', verifyToken, eventRoutes);
app.use('/api/riders', verifyToken, riderRoutes);
app.use('/api/carpools', verifyToken, carpoolRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
