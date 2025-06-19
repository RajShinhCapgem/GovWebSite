const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Critical middleware order as per copilot-instructions.md
// 1. Body parser FIRST
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Static files (your public folder)
app.use(express.static('public'));

// 3. GOV.UK Frontend assets - CRITICAL PATH
app.use('/govuk-frontend', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist')));

// Routes
app.get('/', (req, res) => {
  res.render('simple-form', { 
    title: 'Register animals for vet visit',
    errors: null,
    formData: {}
  });
});

// Form validation rules following copilot-instructions.md patterns
const validateSimpleForm = [
  body('animal-species')
    .notEmpty()
    .withMessage('Select an animal species'),
  body('animal-count')
    .notEmpty()
    .withMessage('Enter the number of animals')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Number of animals must be between 1 and 10,000'),
  body('farm-postcode')
    .trim()
    .notEmpty()
    .withMessage('Enter a postcode')
    .matches(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i)
    .withMessage('Enter a valid UK postcode'),
  body('contact-phone')
    .trim()
    .notEmpty()
    .withMessage('Enter a contact phone number')
    .matches(/^[\+]?[0-9\s\-\(\)]{10,15}$/)
    .withMessage('Enter a valid phone number')
];

app.post('/submit', validateSimpleForm, (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('simple-form', {
      title: 'Register animals for vet visit',
      errors: errors.array(),
      formData: req.body
    });
  }

  // Render success page with submitted data
  res.render('simple-success', {
    title: 'Registration successful',
    data: {
      animalSpecies: req.body['animal-species'],
      animalCount: req.body['animal-count'],
      farmPostcode: req.body['farm-postcode'],
      contactPhone: req.body['contact-phone']
    }
  });
});

app.listen(PORT, () => {
  console.log(`Simple VetVisits app running on http://localhost:${PORT}`);
});
