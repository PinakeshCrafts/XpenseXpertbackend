const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');

const ExpenseRouter = require('./Routes/ExpenseRouter');
const ensureAuthenticated = require('./Middlewares/Auth');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());

// Updated CORS configuration to support deployed environment
const allowedOrigins = [
    'http://localhost:3000',               // Local development
    'https://xpense-xpert-2f5z.onrender.com',   // Replace with your actual frontend URL when deployed
    process.env.FRONTEND_URL               // From environment variable if set
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use('/auth', AuthRouter);
app.use('/expenses', ensureAuthenticated, ExpenseRouter)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})