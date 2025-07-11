const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

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

// API helper functions
async function fetchFromAPI(endpoint) {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error.message);
    throw new Error('Unable to fetch data from API');
  }
}

async function postToAPI(endpoint, data) {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error.message);
    throw new Error('Unable to send data to API');
  }
}

async function putToAPI(endpoint, data) {
  try {
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error.message);
    throw new Error('Unable to update data via API');
  }
}

async function deleteFromAPI(endpoint) {
  try {
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error.message);
    throw new Error('Unable to delete data via API');
  }
}

// Routes
app.get('/', async (req, res) => {
  try {
    const basketData = await fetchFromAPI('/api/basket');
    res.render('start', { basketCount: basketData.data.totals.itemCount });
  } catch (error) {
    console.error('Error fetching basket data:', error.message);
    res.render('start', { basketCount: 0 });
  }
});

app.get('/species-selection', async (req, res) => {
  try {
    const speciesData = await fetchFromAPI('/api/species');
    res.render('species-selection', {
      species: speciesData.data
    });
  } catch (error) {
    console.error('Error fetching species data:', error.message);
    res.status(500).render('404');
  }
});

app.post('/species-selection', async (req, res) => {
  const { species } = req.body;
  const errors = [];

  if (!species || species.length === 0) {
    errors.push({
      text: 'Select at least one species of animal you have',
      href: '#species'
    });
  }

  if (errors.length > 0) {
    try {
      const speciesData = await fetchFromAPI('/api/species');
      return res.render('species-selection', {
        species: speciesData.data,
        errors,
        selectedSpecies: species || []
      });
    } catch (error) {
      return res.status(500).render('404');
    }
  }

  // Store selected species in session-like format (simplified for demo)
  const selectedSpeciesData = Array.isArray(species) ? species : [species];
  const queryParams = selectedSpeciesData.map(s => `species=${encodeURIComponent(s)}`).join('&');
  
  res.redirect(`/animal-counts?${queryParams}`);
});

app.get('/animal-counts', async (req, res) => {
  const selectedSpeciesKeys = Array.isArray(req.query.species) ? req.query.species : [req.query.species];
  
  if (!selectedSpeciesKeys || selectedSpeciesKeys.length === 0) {
    return res.redirect('/species-selection');
  }

  try {
    const speciesData = await fetchFromAPI('/api/species');
    const allSpecies = speciesData.data;
    
    // Create a map for quick lookup
    const speciesMap = {};
    allSpecies.forEach(species => {
      speciesMap[species.key] = species;
    });

    const selectedSpecies = selectedSpeciesKeys
      .filter(key => speciesMap[key])
      .map(key => speciesMap[key]);

    res.render('animal-counts', {
      selectedSpecies,
      formData: req.query
    });
  } catch (error) {
    console.error('Error fetching species data:', error.message);
    res.status(500).render('404');
  }
});

app.post('/animal-counts', async (req, res) => {
  const selectedSpeciesKeys = Array.isArray(req.query.species) ? req.query.species : [req.query.species];
  
  try {
    const speciesData = await fetchFromAPI('/api/species');
    const allSpecies = speciesData.data;
    
    // Create a map for quick lookup
    const speciesMap = {};
    allSpecies.forEach(species => {
      speciesMap[species.key] = species;
    });

    const selectedSpecies = selectedSpeciesKeys
      .filter(key => speciesMap[key])
      .map(key => speciesMap[key]);

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

    // Prepare summary data
    const animalCounts = {};
    
    selectedSpecies.forEach(species => {
      animalCounts[species.name] = {};
      species.subcategories.forEach(subcategory => {
        const fieldName = `${species.key}_${subcategory.toLowerCase().replace(/\s+/g, '_')}`;
        animalCounts[species.name][subcategory] = parseInt(formData[fieldName]);
      });
    });

    // Create registration via API
    const registrationData = await postToAPI('/api/registrations', { animalCounts });
    
    res.render('confirmation', {
      referenceNumber: registrationData.data.referenceNumber,
      animalCounts
    });
  } catch (error) {
    console.error('Error processing animal counts:', error.message);
    res.status(500).render('404');
  }
});

// Tax Details routes
app.get('/tax-details', (req, res) => {
  res.render('tax-details', {
    formData: {}
  });
});

app.post('/tax-details', (req, res) => {
  const { ssn, 'filing-status': filingStatus, dependents } = req.body;
  const errors = [];
  const formData = req.body;

  // Validate Social Security Number
  if (!ssn || ssn.trim() === '') {
    errors.push({
      text: 'Enter your Social Security Number',
      href: '#ssn'
    });
  } else if (!/^\d{3}-?\d{2}-?\d{4}$/.test(ssn.replace(/\s+/g, ''))) {
    errors.push({
      text: 'Enter a valid Social Security Number in the format 123-45-6789',
      href: '#ssn'
    });
  }

  // Validate Filing Status
  if (!filingStatus || filingStatus === '') {
    errors.push({
      text: 'Select your filing status',
      href: '#filing-status'
    });
  }

  // Validate Number of Dependents
  if (dependents === '' || dependents === null || dependents === undefined) {
    errors.push({
      text: 'Enter the number of dependents',
      href: '#dependents'
    });
  } else if (isNaN(dependents) || parseInt(dependents) < 0) {
    errors.push({
      text: 'Number of dependents must be 0 or more',
      href: '#dependents'
    });
  }

  if (errors.length > 0) {
    return res.render('tax-details', {
      errors,
      formData
    });
  }

  // Generate reference number
  const referenceNumber = `TAX${Date.now().toString().slice(-6)}`;
  
  // Mask SSN for display (show only last 4 digits)
  const ssnMasked = `***-**-${ssn.slice(-4)}`;
  
  // Convert filing status to display format
  const filingStatusMap = {
    'single': 'Single',
    'married-filing-jointly': 'Married Filing Jointly',
    'married-filing-separately': 'Married Filing Separately',
    'head-of-household': 'Head of Household',
    'qualifying-widow': 'Qualifying Widow(er)'
  };

  const taxDetails = {
    ssn: ssn,
    ssnMasked: ssnMasked,
    filingStatus: filingStatus,
    filingStatusDisplay: filingStatusMap[filingStatus],
    dependents: parseInt(dependents)
  };

  res.render('tax-confirmation', {
    referenceNumber,
    taxDetails
  });
});

// Basket routes
app.get('/basket', async (req, res) => {
  try {
    const basketData = await fetchFromAPI('/api/basket');
    res.render('basket', {
      basket: basketData.data.items,
      totals: basketData.data.totals
    });
  } catch (error) {
    console.error('Error fetching basket data:', error.message);
    res.status(500).render('404');
  }
});

app.post('/basket/add', async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  try {
    await postToAPI('/api/basket/add', { productId, quantity: parseInt(quantity) });
    res.redirect('/basket');
  } catch (error) {
    console.error('Error adding item to basket:', error.message);
    res.redirect('/basket');
  }
});

app.post('/basket/update', async (req, res) => {
  const { itemIndex, quantity } = req.body;
  const errors = [];

  try {
    // Get current basket data to find the product ID
    const basketData = await fetchFromAPI('/api/basket');
    const item = basketData.data.items[itemIndex];
    
    if (item) {
      const newQuantity = parseFloat(quantity);
      
      if (isNaN(newQuantity) || newQuantity < 0) {
        errors.push({
          text: 'Enter a valid quantity',
          href: `#quantity-${itemIndex}`
        });
      } else if (newQuantity === 0) {
        // Remove item from basket
        await deleteFromAPI(`/api/basket/remove/${item.product.id}`);
      } else {
        await putToAPI(`/api/basket/update/${item.product.id}`, { quantity: newQuantity });
      }
    }
  } catch (error) {
    console.error('Error updating basket:', error.message);
  }

  if (errors.length > 0) {
    try {
      const basketData = await fetchFromAPI('/api/basket');
      return res.render('basket', {
        basket: basketData.data.items,
        totals: basketData.data.totals,
        errors
      });
    } catch (error) {
      return res.status(500).render('404');
    }
  }

  res.redirect('/basket');
});

app.post('/basket/remove', async (req, res) => {
  const { itemIndex } = req.body;
  
  try {
    // Get current basket data to find the product ID
    const basketData = await fetchFromAPI('/api/basket');
    const item = basketData.data.items[itemIndex];
    
    if (item) {
      await deleteFromAPI(`/api/basket/remove/${item.product.id}`);
    }
  } catch (error) {
    console.error('Error removing item from basket:', error.message);
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
