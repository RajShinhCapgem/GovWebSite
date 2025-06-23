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

app.set('view engine', 'html');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: 'vetvisits-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Static files - CRITICAL: Correct paths for govuk-frontend v5.10.0+
app.use('/assets', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/assets')));
app.use('/govuk-frontend', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk')));

// Animal species data with subcategories
const animalSpecies = {
  cattle: {
    name: 'Cattle',
    key: 'cattle',
    subcategories: [
      { name: 'Dairy cows', key: 'dairy_cows' },
      { name: 'Beef cattle', key: 'beef_cattle' },
      { name: 'Bulls', key: 'bulls' },
      { name: 'Calves', key: 'calves' }
    ]
  },
  sheep: {
    name: 'Sheep',
    key: 'sheep',
    subcategories: [
      { name: 'Ewes', key: 'ewes' },
      { name: 'Rams', key: 'rams' },
      { name: 'Lambs', key: 'lambs' }
    ]
  },
  pigs: {
    name: 'Pigs',
    key: 'pigs',
    subcategories: [
      { name: 'Sows', key: 'sows' },
      { name: 'Boars', key: 'boars' },
      { name: 'Piglets', key: 'piglets' },
      { name: 'Fattening pigs', key: 'fattening_pigs' }
    ]
  },
  poultry: {
    name: 'Poultry',
    key: 'poultry',
    subcategories: [
      { name: 'Laying hens', key: 'laying_hens' },
      { name: 'Broilers', key: 'broilers' },
      { name: 'Turkeys', key: 'turkeys' },
      { name: 'Ducks', key: 'ducks' },
      { name: 'Geese', key: 'geese' }
    ]
  },
  horses: {
    name: 'Horses',
    key: 'horses',
    subcategories: [
      { name: 'Mares', key: 'mares' },
      { name: 'Stallions', key: 'stallions' },
      { name: 'Geldings', key: 'geldings' },
      { name: 'Foals', key: 'foals' }
    ]
  }
};

// Basket items data (from the image)
const basketItems = [
  {
    id: 'heirloom-tomato',
    name: 'Heirloom tomato',
    pricePerUnit: 5.99,
    unit: 'lb',
    quantity: 1,
    totalPrice: 5.99
  },
  {
    id: 'organic-ginger',
    name: 'Organic ginger', 
    pricePerUnit: 12.99,
    unit: 'lb',
    quantity: 0.5,
    totalPrice: 6.50
  },
  {
    id: 'sweet-onion',
    name: 'Sweet onion',
    pricePerUnit: 2.99,
    unit: 'lb', 
    quantity: 5,
    totalPrice: 14.95
  }
];

// Generate reference number
function generateReferenceNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `VV${timestamp}${random}`;
}

// Routes
app.get('/', (req, res) => {
  res.render('start', {
    pageTitle: 'Register animals for vet visits',
    serviceName: 'Register animals for vet visits'
  });
});

app.get('/basket', (req, res) => {
  // Calculate totals
  const subtotal = basketItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = 3.99;
  const tax = 2.00;
  const total = subtotal + shipping + tax;

  res.render('basket', {
    pageTitle: 'Your basket',
    serviceName: 'Register animals for vet visits',
    basketItems: basketItems,
    summary: {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      itemCount: basketItems.length
    }
  });
});

app.get('/species', (req, res) => {
  res.render('species', {
    pageTitle: 'Which animals do you have?',
    serviceName: 'Register animals for vet visits',
    species: animalSpecies
  });
});

app.post('/species', (req, res) => {
  const selectedSpecies = req.body.species;
  
  if (!selectedSpecies || selectedSpecies.length === 0) {
    return res.render('species', {
      pageTitle: 'Which animals do you have?',
      serviceName: 'Register animals for vet visits',
      species: animalSpecies,
      error: {
        message: 'Select which animals you have',
        items: [
          {
            text: 'Select which animals you have',
            href: '#species'
          }
        ]
      }
    });
  }

  // Store selected species in session-like object for demo
  req.session = req.session || {};
  req.session.selectedSpecies = Array.isArray(selectedSpecies) ? selectedSpecies : [selectedSpecies];
  
  res.redirect('/animal-counts');
});

app.get('/animal-counts', (req, res) => {
  const selectedSpecies = req.session?.selectedSpecies || [];
  
  if (selectedSpecies.length === 0) {
    return res.redirect('/species');
  }

  const speciesData = selectedSpecies.map(key => animalSpecies[key]).filter(Boolean);
  
  res.render('animal-counts', {
    pageTitle: 'How many animals do you have?',
    serviceName: 'Register animals for vet visits',
    speciesData: speciesData
  });
});

app.post('/animal-counts', (req, res) => {
  const selectedSpecies = req.session?.selectedSpecies || [];
  const animalCounts = req.body;
  
  if (selectedSpecies.length === 0) {
    return res.redirect('/species');
  }

  // Validate that all required fields have values
  const errors = [];
  const speciesData = selectedSpecies.map(key => animalSpecies[key]).filter(Boolean);
  
  for (const species of speciesData) {
    for (const subcategory of species.subcategories) {
      const fieldName = `${species.key}_${subcategory.key}`;
      const value = animalCounts[fieldName];
      
      if (!value || value.trim() === '' || isNaN(value) || parseInt(value) < 0) {
        errors.push({
          text: `Enter the number of ${subcategory.name.toLowerCase()}`,
          href: `#${fieldName}`
        });
      }
    }
  }

  if (errors.length > 0) {
    return res.render('animal-counts', {
      pageTitle: 'How many animals do you have?',
      serviceName: 'Register animals for vet visits',
      speciesData: speciesData,
      values: animalCounts,
      error: {
        message: 'There is a problem',
        items: errors
      }
    });
  }

  // Store animal counts and generate reference number
  req.session.animalCounts = animalCounts;
  req.session.referenceNumber = generateReferenceNumber();
  
  res.redirect('/confirmation');
});

app.get('/confirmation', (req, res) => {
  const selectedSpecies = req.session?.selectedSpecies || [];
  const animalCounts = req.session?.animalCounts || {};
  const referenceNumber = req.session?.referenceNumber;
  
  if (selectedSpecies.length === 0 || !referenceNumber) {
    return res.redirect('/species');
  }

  // Prepare data for summary
  const summaryData = [];
  
  for (const speciesKey of selectedSpecies) {
    const species = animalSpecies[speciesKey];
    if (species) {
      for (const subcategory of species.subcategories) {
        const fieldName = `${species.key}_${subcategory.key}`;
        const count = animalCounts[fieldName];
        
        if (count && parseInt(count) > 0) {
          summaryData.push({
            species: species.name,
            subcategory: subcategory.name,
            count: parseInt(count)
          });
        }
      }
    }
  }
  
  res.render('confirmation', {
    pageTitle: 'Registration complete',
    serviceName: 'Register animals for vet visits',
    referenceNumber: referenceNumber,
    summaryData: summaryData
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
