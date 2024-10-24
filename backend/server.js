// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a schema and model for users
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Signup route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    try {
        await newUser.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(400).send('Error creating user');
    }
});

// Define a schema and model for calorie data
const calorieSchema = new mongoose.Schema({
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    bodyFat: Number,
    formula: String,
    bmr: Number
});

const Calorie = mongoose.model('Calorie', calorieSchema);

// Route to handle calorie form submissions
app.post('/calorie', async (req, res) => {
    const { age, gender, height, weight, bodyFat, formula, bmr } = req.body;
    const newCalorie = new Calorie({ age, gender, height, weight, bodyFat, formula, bmr });
    try {
        await newCalorie.save();
        res.status(201).send('Calorie data saved');
    } catch (error) {
        res.status(400).send('Error saving calorie data');
    }
});

// Define a schema and model for FFMI data
const ffmiSchema = new mongoose.Schema({
    weight: Number,
    bodyFat: Number,
    heightFeet: Number,
    heightInches: Number,
    totalBodyFat: Number,
    leanWeight: Number,
    ffmi: Number,
    adjustedFfmi: Number
});

const FFMI = mongoose.model('FFMI', ffmiSchema);

// Route to handle FFMI form submissions
app.post('/ffmi', async (req, res) => {
    const { weight, bodyFat, heightFeet, heightInches, totalBodyFat, leanWeight, ffmi, adjustedFfmi } = req.body;
    const newFFMI = new FFMI({ weight, bodyFat, heightFeet, heightInches, totalBodyFat, leanWeight, ffmi, adjustedFfmi });
    try {
        await newFFMI.save();
        res.status(201).send('FFMI data saved');
    } catch (error) {
        res.status(400).send('Error saving FFMI data');
    }
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});