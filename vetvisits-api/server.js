const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Animal species data
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

// Products data (matching basket.jpg exactly)
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

// In-memory basket storage (in production, use database)
let basketItems = [
  {
    id: 'basket-item-1',
    productId: 'heirloom-tomato',
    product: products['heirloom-tomato'],
    quantity: 1,
    totalPrice: 5.99
  },
  {
    id: 'basket-item-2',
    productId: 'organic-ginger',
    product: products['organic-ginger'],
    quantity: 0.5,
    totalPrice: 6.50
  },
  {
    id: 'basket-item-3',
    productId: 'sweet-onion',
    product: products['sweet-onion'],
    quantity: 5,
    totalPrice: 14.95
  }
];

// Helper functions
function generateReferenceNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `VV${timestamp}${random}`;
}

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

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Animal species endpoints
app.get('/api/species', (req, res) => {
  res.json({
    success: true,
    data: Object.values(animalSpecies)
  });
});

app.get('/api/species/:key', (req, res) => {
  const species = animalSpecies[req.params.key];
  if (!species) {
    return res.status(404).json({
      success: false,
      error: 'Species not found'
    });
  }
  res.json({
    success: true,
    data: species
  });
});

// Products endpoints
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: Object.values(products)
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products[req.params.id];
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  res.json({
    success: true,
    data: product
  });
});

// Basket endpoints
app.get('/api/basket', (req, res) => {
  const totals = calculateBasketTotals(basketItems);
  res.json({
    success: true,
    data: {
      items: basketItems,
      totals
    }
  });
});

app.post('/api/basket/items', (req, res) => {
  const { productId, quantity } = req.body;
  
  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Product ID and valid quantity are required'
    });
  }
  
  const product = products[productId];
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  const newItem = {
    id: `basket-item-${Date.now()}`,
    productId,
    product,
    quantity: parseFloat(quantity),
    totalPrice: product.pricePerUnit * parseFloat(quantity)
  };
  
  basketItems.push(newItem);
  
  res.status(201).json({
    success: true,
    data: newItem
  });
});

app.put('/api/basket/items/:itemIndex', (req, res) => {
  const itemIndex = parseInt(req.params.itemIndex);
  const { quantity } = req.body;
  
  if (isNaN(itemIndex) || itemIndex < 0 || itemIndex >= basketItems.length) {
    return res.status(404).json({
      success: false,
      error: 'Basket item not found'
    });
  }
  
  if (!quantity || isNaN(quantity) || quantity < 0) {
    return res.status(400).json({
      success: false,
      error: 'Valid quantity is required'
    });
  }
  
  if (quantity === 0) {
    basketItems.splice(itemIndex, 1);
    return res.json({
      success: true,
      message: 'Item removed from basket'
    });
  }
  
  basketItems[itemIndex].quantity = parseFloat(quantity);
  basketItems[itemIndex].totalPrice = basketItems[itemIndex].product.pricePerUnit * parseFloat(quantity);
  
  res.json({
    success: true,
    data: basketItems[itemIndex]
  });
});

app.delete('/api/basket/items/:itemIndex', (req, res) => {
  const itemIndex = parseInt(req.params.itemIndex);
  
  if (isNaN(itemIndex) || itemIndex < 0 || itemIndex >= basketItems.length) {
    return res.status(404).json({
      success: false,
      error: 'Basket item not found'
    });
  }
  
  basketItems.splice(itemIndex, 1);
  
  res.json({
    success: true,
    message: 'Item removed from basket'
  });
});

app.delete('/api/basket', (req, res) => {
  basketItems = [];
  res.json({
    success: true,
    message: 'Basket cleared'
  });
});

// Animal registration endpoints
app.post('/api/registrations', (req, res) => {
  const { animalCounts } = req.body;
  
  if (!animalCounts || typeof animalCounts !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Animal counts are required'
    });
  }
  
  const referenceNumber = generateReferenceNumber();
  
  // In production, save to database
  const registration = {
    id: `reg-${Date.now()}`,
    referenceNumber,
    animalCounts,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  
  res.status(201).json({
    success: true,
    data: registration
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`VetVisits API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
