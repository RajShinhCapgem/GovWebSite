const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Nunjucks
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
});

// Set view engine
app.set('view engine', 'njk');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(session({
  secret: 'vetvisits-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Serve static files from GOV.UK Frontend
app.use('/assets', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/assets')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Animal species data with subcategories
const animalData = {
  cattle: {
    name: 'Cattle',
    subcategories: [
      { id: 'dairy-cows', name: 'Dairy cows' },
      { id: 'beef-cattle', name: 'Beef cattle' },
      { id: 'bulls', name: 'Bulls' },
      { id: 'calves', name: 'Calves' }
    ]
  },
  sheep: {
    name: 'Sheep',
    subcategories: [
      { id: 'ewes', name: 'Ewes' },
      { id: 'rams', name: 'Rams' },
      { id: 'lambs', name: 'Lambs' },
      { id: 'wethers', name: 'Wethers' }
    ]
  },
  pigs: {
    name: 'Pigs',
    subcategories: [
      { id: 'breeding-sows', name: 'Breeding sows' },
      { id: 'boars', name: 'Boars' },
      { id: 'piglets', name: 'Piglets' },
      { id: 'finishing-pigs', name: 'Finishing pigs' }
    ]
  },
  poultry: {
    name: 'Poultry',
    subcategories: [
      { id: 'laying-hens', name: 'Laying hens' },
      { id: 'broiler-chickens', name: 'Broiler chickens' },
      { id: 'ducks', name: 'Ducks' },
      { id: 'geese', name: 'Geese' },
      { id: 'turkeys', name: 'Turkeys' }
    ]
  }
};

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    serviceName: 'Register animals for vet visits',
    pageTitle: 'Register animals for vet visits'
  });
});

app.get('/species-selection', (req, res) => {
  res.render('species-selection', {
    serviceName: 'Register animals for vet visits',
    pageTitle: 'What species do you have?',
    animalData: animalData,
    errors: req.session.errors,
    formData: req.session.formData
  });
  
  // Clear session errors and form data after displaying
  delete req.session.errors;
  delete req.session.formData;
});

app.post('/species-selection', (req, res) => {
  const selectedSpecies = req.body.species;
  
  if (!selectedSpecies || selectedSpecies.length === 0) {
    req.session.errors = {
      species: {
        text: 'Select at least one species'
      }
    };
    req.session.formData = req.body;
    return res.redirect('/species-selection');
  }
  
  // Store selected species in session
  req.session.selectedSpecies = Array.isArray(selectedSpecies) ? selectedSpecies : [selectedSpecies];
  res.redirect('/animal-counts');
});

app.get('/animal-counts', (req, res) => {
  const selectedSpecies = req.session.selectedSpecies;
  
  if (!selectedSpecies || selectedSpecies.length === 0) {
    return res.redirect('/species-selection');
  }
  
  // Build form data for selected species
  const speciesData = selectedSpecies.map(speciesId => ({
    id: speciesId,
    ...animalData[speciesId]
  }));
  
  res.render('animal-counts', {
    serviceName: 'Register animals for vet visits',
    pageTitle: 'How many animals do you have?',
    speciesData: speciesData,
    errors: req.session.errors,
    formData: req.session.formData
  });
  
  // Clear session errors and form data after displaying
  delete req.session.errors;
  delete req.session.formData;
});

app.post('/animal-counts', (req, res) => {
  const selectedSpecies = req.session.selectedSpecies;
  const errors = {};
  let hasErrors = false;
  
  // Validate that all subcategories have valid counts
  selectedSpecies.forEach(speciesId => {
    const species = animalData[speciesId];
    species.subcategories.forEach(subcategory => {
      const count = req.body[subcategory.id];
      if (!count || count === '' || isNaN(count) || parseInt(count) < 0) {
        errors[subcategory.id] = {
          text: `Enter the number of ${subcategory.name.toLowerCase()}`
        };
        hasErrors = true;
      } else if (parseInt(count) === 0) {
        errors[subcategory.id] = {
          text: `Number of ${subcategory.name.toLowerCase()} must be greater than 0`
        };
        hasErrors = true;
      }
    });
  });
  
  if (hasErrors) {
    req.session.errors = errors;
    req.session.formData = req.body;
    return res.redirect('/animal-counts');
  }
  
  // Store animal counts in session
  req.session.animalCounts = req.body;
  res.redirect('/confirmation');
});

app.get('/confirmation', (req, res) => {
  const selectedSpecies = req.session.selectedSpecies;
  const animalCounts = req.session.animalCounts;
  
  if (!selectedSpecies || !animalCounts) {
    return res.redirect('/species-selection');
  }
  
  // Build confirmation data
  const confirmationData = selectedSpecies.map(speciesId => {
    const species = animalData[speciesId];
    const subcategoriesWithCounts = species.subcategories.map(subcategory => ({
      ...subcategory,
      count: animalCounts[subcategory.id]
    }));
    
    const totalCount = subcategoriesWithCounts.reduce((sum, sub) => sum + parseInt(sub.count), 0);
    
    return {
      id: speciesId,
      name: species.name,
      subcategories: subcategoriesWithCounts,
      totalCount: totalCount
    };
  });
  
  res.render('confirmation', {
    serviceName: 'Register animals for vet visits',
    pageTitle: 'Registration complete',
    confirmationData: confirmationData
  });
  
  // Clear session data after confirmation
  delete req.session.selectedSpecies;
  delete req.session.animalCounts;
});

// Start again route
app.get('/start-again', (req, res) => {
  // Clear all session data
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
