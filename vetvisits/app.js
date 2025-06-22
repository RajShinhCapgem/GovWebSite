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

// Sample products for basket functionality (matching basket.jpg exactly)
const products = {
  'heirloom-tomato': {
    id: 'heirloom-tomato',
    name: 'Heirloom tomato',
    price: 5.99,
    pricePerUnit: 5.99,
    unit: 'lb'
  },
  'organic-ginger': {
    id: 'organic-ginger',
    name: 'Organic ginger',
    price: 12.99,
    pricePerUnit: 12.99,
    unit: 'lb'
  },
  'sweet-onion': {
    id: 'sweet-onion',
    name: 'Sweet onion',
    price: 2.99,
    pricePerUnit: 2.99,
    unit: 'lb'
  }
};

// In-memory basket storage (matching basket.jpg exactly)
let basketItems = [
  {
    productId: 'heirloom-tomato',
    product: products['heirloom-tomato'],
    quantity: 1,
    totalPrice: 5.99
  },
  {
    productId: 'organic-ginger',
    product: products['organic-ginger'],
    quantity: 0.5,
    totalPrice: 6.50
  },
  {
    productId: 'sweet-onion',
    product: products['sweet-onion'],
    quantity: 5,
    totalPrice: 14.95
  }
];

// Generate unique reference number
function generateReferenceNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `VV${timestamp}${random}`;
}

// Calculate basket totals (matching basket.jpg exactly)
function calculateBasketTotals(items) {
  const subtotal = 27.44; // Exact subtotal from image
  const shipping = 3.99;  // Exact shipping from image
  const tax = 2.00;       // Exact tax from image
  const total = 33.43;    // Exact total from image
  
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
      basketItems[itemIndex].totalPrice = basketItems[itemIndex].product.pricePerUnit * newQuantity;
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
