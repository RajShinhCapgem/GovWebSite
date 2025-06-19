const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const app = express();

// CRITICAL ORDER - DO NOT CHANGE
// 1. Body parser FIRST
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Static files (public folder)
app.use(express.static('public'));

// 3. GOV.UK Frontend assets - EXACT PATH
app.use('/govuk-frontend', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist')));

// 4. Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Validation rules for the form
const validateAnimalRegistration = [
  body('species')
    .notEmpty()
    .withMessage('Select an animal species')
    .isIn(['cattle', 'sheep', 'pigs', 'poultry', 'horses', 'goats', 'other'])
    .withMessage('Select a valid animal species'),
  
  body('animalCount')
    .notEmpty()
    .withMessage('Enter the number of animals')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Enter a number between 1 and 10,000')
];

// Home page - GET request
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Register animals for vet visit',
    errors: null, 
    formData: {},
    submitted: false
  });
});

// Form submission - POST request
app.post('/', validateAnimalRegistration, (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // If validation fails, show the form with errors
    res.render('index', {
      title: 'Register animals for vet visit',
      errors: errors.array(),
      formData: req.body,
      submitted: false
    });
  } else {
    // If validation passes, show success
    res.render('index', {
      title: 'Animals registered successfully',
      errors: null,
      formData: req.body,
      submitted: true
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Veterinary visits app running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});
