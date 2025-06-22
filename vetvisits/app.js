const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Nunjucks
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// Set view engine
app.set('view engine', 'html');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static file serving - correct paths for govuk-frontend v5.10.0+
app.use('/assets', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/assets')));
app.use('/govuk-frontend', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk')));

// Define animal species and their subcategories
const animalSpecies = {
  cattle: {
    name: 'Cattle',
    key: 'cattle',
    subcategories: ['Dairy cows', 'Beef cattle', 'Bulls', 'Calves']
  },
  sheep: {
    name: 'Sheep',
    key: 'sheep',
    subcategories: ['Ewes', 'Rams', 'Lambs', 'Wethers']
  },
  pigs: {
    name: 'Pigs',
    key: 'pigs',
    subcategories: ['Sows', 'Boars', 'Piglets', 'Finisher pigs']
  },
  poultry: {
    name: 'Poultry',
    key: 'poultry',
    subcategories: ['Chickens', 'Ducks', 'Geese', 'Turkeys']
  },
  horses: {
    name: 'Horses',
    key: 'horses',
    subcategories: ['Mares', 'Stallions', 'Geldings', 'Foals']
  }
};

// Sample vet services for basket functionality
const vetServices = {
  'health-check': {
    id: 'health-check',
    name: 'General health check',
    description: 'Comprehensive health examination',
    price: 45.00,
    unit: 'per animal'
  },
  'vaccination': {
    id: 'vaccination',
    name: 'Vaccination service',
    description: 'Standard vaccinations for livestock',
    price: 25.00,
    unit: 'per animal'
  },
  'emergency-visit': {
    id: 'emergency-visit',
    name: 'Emergency call-out',
    description: '24/7 emergency veterinary service',
    price: 95.00,
    unit: 'per visit'
  }
};

// In-memory basket storage (in production, use proper session management)
let basketItems = [
  {
    serviceId: 'health-check',
    service: vetServices['health-check'],
    quantity: 1,
    notes: 'For heirloom tomato health check'
  },
  {
    serviceId: 'vaccination',
    service: vetServices['vaccination'],
    quantity: 0.5,
    notes: 'Organic ginger vaccination'
  },
  {
    serviceId: 'emergency-visit',
    service: vetServices['emergency-visit'],
    quantity: 5,
    notes: 'Sweet onion emergency service'
  }
];

// Generate unique reference number
function generateReferenceNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `VV${timestamp}${random}`;
}

// Calculate basket totals
function calculateBasketTotals(items) {
  const subtotal = items.reduce((total, item) => {
    return total + (item.service.price * item.quantity);
  }, 0);
  
  const shipping = 3.99;
  const tax = 2.00;
  const total = subtotal + shipping + tax;
  
  return {
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
    itemCount: items.length
  };
}

// Routes
app.get('/', (req, res) => {
  const totals = calculateBasketTotals(basketItems);
  res.render('start', { basketCount: totals.itemCount });
});

app.get('/species-selection', (req, res) => {
  res.render('species-selection', {
    species: Object.values(animalSpecies)
  });
});

app.post('/species-selection', (req, res) => {
  const { species } = req.body;
  const errors = [];

  if (!species || species.length === 0) {
    errors.push({
      text: 'Select at least one species of animal you have',
      href: '#species'
    });
  }

  if (errors.length > 0) {
    return res.render('species-selection', {
      species: Object.values(animalSpecies),
      errors,
      selectedSpecies: species || []
    });
  }

  // Store selected species in session-like format (simplified for demo)
  const selectedSpeciesData = Array.isArray(species) ? species : [species];
  const queryParams = selectedSpeciesData.map(s => `species=${encodeURIComponent(s)}`).join('&');
  
  res.redirect(`/animal-counts?${queryParams}`);
});

app.get('/animal-counts', (req, res) => {
  const selectedSpeciesKeys = Array.isArray(req.query.species) ? req.query.species : [req.query.species];
  
  if (!selectedSpeciesKeys || selectedSpeciesKeys.length === 0) {
    return res.redirect('/species-selection');
  }

  const selectedSpecies = selectedSpeciesKeys
    .filter(key => animalSpecies[key])
    .map(key => animalSpecies[key]);

  res.render('animal-counts', {
    selectedSpecies,
    formData: req.query
  });
});

app.post('/animal-counts', (req, res) => {
  const selectedSpeciesKeys = Array.isArray(req.query.species) ? req.query.species : [req.query.species];
  const selectedSpecies = selectedSpeciesKeys
    .filter(key => animalSpecies[key])
    .map(key => animalSpecies[key]);

  const errors = [];
  const formData = req.body;

  // Validate animal counts
  selectedSpecies.forEach(species => {
    species.subcategories.forEach(subcategory => {
      const fieldName = `${species.key}_${subcategory.toLowerCase().replace(/\s+/g, '_')}`;
      const value = formData[fieldName];
      
      if (!value || value === '' || isNaN(value) || parseInt(value) < 0) {
        errors.push({
          text: `Enter the number of ${subcategory.toLowerCase()} you have`,
          href: `#${fieldName}`
        });
      }
    });
  });

  if (errors.length > 0) {
    return res.render('animal-counts', {
      selectedSpecies,
      errors,
      formData
    });
  }

  // Generate reference number and prepare summary data
  const referenceNumber = generateReferenceNumber();
  const animalCounts = {};
  
  selectedSpecies.forEach(species => {
    animalCounts[species.name] = {};
    species.subcategories.forEach(subcategory => {
      const fieldName = `${species.key}_${subcategory.toLowerCase().replace(/\s+/g, '_')}`;
      animalCounts[species.name][subcategory] = parseInt(formData[fieldName]);
    });
  });
  res.render('confirmation', {
    referenceNumber,
    animalCounts
  });
});

// Basket routes
app.get('/basket', (req, res) => {
  const totals = calculateBasketTotals(basketItems);
  res.render('basket', {
    basketItems,
    totals
  });
});

app.post('/basket/update', (req, res) => {
  const { itemIndex, quantity } = req.body;
  const errors = [];

  if (itemIndex !== undefined && basketItems[itemIndex]) {
    const newQuantity = parseFloat(quantity);
    
    if (isNaN(newQuantity) || newQuantity < 0) {
      errors.push({
        text: 'Enter a valid quantity',
        href: `#quantity-${itemIndex}`
      });
    } else if (newQuantity === 0) {
      // Remove item from basket
      basketItems.splice(itemIndex, 1);
    } else {
      basketItems[itemIndex].quantity = newQuantity;
    }
  }

  if (errors.length > 0) {
    const totals = calculateBasketTotals(basketItems);
    return res.render('basket', {
      basketItems,
      totals,
      errors
    });
  }

  res.redirect('/basket');
});

app.post('/basket/remove', (req, res) => {
  const { itemIndex } = req.body;
  
  if (itemIndex !== undefined && basketItems[itemIndex]) {
    basketItems.splice(itemIndex, 1);
  }
  
  res.redirect('/basket');
});

// Error handler
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
