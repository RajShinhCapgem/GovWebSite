const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve GOV.UK Frontend assets
app.use('/govuk-frontend', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Register animal for vet visit',
    errors: null,
    formData: {}
  });
});

// Form validation rules
const validateForm = [
  body('animal-type')
    .notEmpty()
    .withMessage('Select an animal type'),
  body('animal-id')
    .trim()
    .notEmpty()
    .withMessage('Enter an animal ID or ear tag number')
    .isLength({ min: 2, max: 20 })
    .withMessage('Animal ID must be between 2 and 20 characters'),
  body('farm-postcode')
    .trim()
    .notEmpty()
    .withMessage('Enter a postcode')
    .matches(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i)
    .withMessage('Enter a valid UK postcode'),
  body('visit-date-day')
    .notEmpty()
    .withMessage('Enter a day')
    .isInt({ min: 1, max: 31 })
    .withMessage('Day must be between 1 and 31'),
  body('visit-date-month')
    .notEmpty()
    .withMessage('Enter a month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  body('visit-date-year')
    .notEmpty()
    .withMessage('Enter a year')
    .isInt({ min: new Date().getFullYear(), max: new Date().getFullYear() + 1 })
    .withMessage('Year must be this year or next year'),
  body('contact-phone')
    .trim()
    .notEmpty()
    .withMessage('Enter a contact phone number')
    .matches(/^[\+]?[0-9\s\-\(\)]{10,15}$/)
    .withMessage('Enter a valid phone number')
];

app.post('/submit', validateForm, (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('index', {
      title: 'Register animal for vet visit',
      errors: errors.array(),
      formData: req.body
    });
  }

  // Format the date
  const visitDate = `${req.body['visit-date-day']}/${req.body['visit-date-month']}/${req.body['visit-date-year']}`;
  
  // Render success page with submitted data
  res.render('success', {
    title: 'Registration successful',
    data: {
      animalType: req.body['animal-type'],
      animalId: req.body['animal-id'],
      farmPostcode: req.body['farm-postcode'],
      visitDate: visitDate,
      contactPhone: req.body['contact-phone']
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
