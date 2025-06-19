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

// Define animal species options
const animalSpecies = [
  { value: 'cattle', text: 'Cattle' },
  { value: 'sheep', text: 'Sheep' },
  { value: 'pigs', text: 'Pigs' },
  { value: 'horses', text: 'Horses' },
  { value: 'poultry', text: 'Poultry' },
  { value: 'other', text: 'Other' }
];

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Register Animals for Vet Visits',
    serviceName: 'Farm Animal Vet Visit Registration',
    errors: null, 
    formData: {},
    animalSpecies: animalSpecies
  });
});

app.post('/', [
  body('species')
    .notEmpty()
    .withMessage('Select the animal species'),
  body('count')
    .notEmpty()
    .withMessage('Enter the number of animals')
    .isInt({ min: 1 })
    .withMessage('Number of animals must be 1 or more')
], (req, res) => {
  const errors = validationResult(req);
  const formData = req.body;
  
  if (!errors.isEmpty()) {
    return res.render('index', {
      title: 'Register Animals for Vet Visits',
      serviceName: 'Farm Animal Vet Visit Registration',
      errors: errors.array(),
      formData: formData,
      animalSpecies: animalSpecies
    });
  }
  
  // If validation passes, show success page
  res.render('success', {
    title: 'Registration Complete',
    serviceName: 'Farm Animal Vet Visit Registration',
    formData: formData
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
