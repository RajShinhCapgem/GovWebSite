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

// Animal species data with subcategories
const animalSpecies = {
  cattle: {
    name: 'Cattle',
    subcategories: ['Dairy cows', 'Beef cattle', 'Bulls', 'Calves']
  },
  sheep: {
    name: 'Sheep',
    subcategories: ['Ewes', 'Rams', 'Lambs', 'Wethers']
  },
  pigs: {
    name: 'Pigs',
    subcategories: ['Sows', 'Boars', 'Piglets', 'Gilts']
  },
  poultry: {
    name: 'Poultry',
    subcategories: ['Laying hens', 'Broilers', 'Roosters', 'Chicks']
  },
  goats: {
    name: 'Goats',
    subcategories: ['Does', 'Bucks', 'Kids', 'Wethers']
  },
  horses: {
    name: 'Horses',
    subcategories: ['Mares', 'Stallions', 'Geldings', 'Foals']
  }
};

// Routes
app.get('/', (req, res) => {
  res.render('species-selection', { 
    title: 'Select animal species',
    errors: null,
    formData: {},
    animalSpecies: animalSpecies
  });
});

app.post('/species', [
  body('species').notEmpty().withMessage('Select which animals you have')
], (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('species-selection', {
      title: 'Select animal species',
      errors: errors.array(),
      formData: req.body,
      animalSpecies: animalSpecies
    });
  }

  const selectedSpecies = req.body.species;
  const speciesData = animalSpecies[selectedSpecies];
  
  if (!speciesData) {
    return res.render('species-selection', {
      title: 'Select animal species',
      errors: [{ path: 'species', msg: 'Please select a valid animal species' }],
      formData: req.body,
      animalSpecies: animalSpecies
    });
  }

  res.render('animal-count', {
    title: `Add your ${speciesData.name.toLowerCase()} numbers`,
    errors: null,
    formData: {},
    selectedSpecies: selectedSpecies,
    speciesData: speciesData
  });
});

app.post('/submit', (req, res) => {
  const selectedSpecies = req.body.selectedSpecies;
  const speciesData = animalSpecies[selectedSpecies];
  
  // Build validation rules dynamically
  const validationRules = speciesData.subcategories.map(subcategory => {
    const fieldName = subcategory.toLowerCase().replace(/\s+/g, '-');
    return body(fieldName)
      .isInt({ min: 0 })
      .withMessage(`Enter a number 0 or above for ${subcategory.toLowerCase()}`);
  });

  // Run validation
  Promise.all(validationRules.map(rule => rule.run(req))).then(() => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.render('animal-count', {
        title: `Add your ${speciesData.name.toLowerCase()} numbers`,
        errors: errors.array(),
        formData: req.body,
        selectedSpecies: selectedSpecies,
        speciesData: speciesData
      });
    }

    // Calculate totals
    const animalCounts = {};
    let totalAnimals = 0;
    
    speciesData.subcategories.forEach(subcategory => {
      const fieldName = subcategory.toLowerCase().replace(/\s+/g, '-');
      const count = parseInt(req.body[fieldName]) || 0;
      animalCounts[subcategory] = count;
      totalAnimals += count;
    });

    res.render('confirmation', {
      title: 'Registration complete',
      selectedSpecies: selectedSpecies,
      speciesData: speciesData,
      animalCounts: animalCounts,
      totalAnimals: totalAnimals
    });
  });
});

app.get('/start-again', (req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vet visits app running on http://localhost:${PORT}`);
});
