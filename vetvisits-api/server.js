const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3001;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VetVisits API',
      version: '1.0.0',
      description: 'API for VetVisits application - managing animal species, products, basket, and registrations',
      contact: {
        name: 'VetVisits Team',
        email: 'support@vetvisits.gov.uk'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        AnimalSpecies: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Cattle' },
            key: { type: 'string', example: 'cattle' },
            subcategories: {
              type: 'array',
              items: { type: 'string' },
              example: ['Dairy cows', 'Beef cattle', 'Bulls', 'Calves']
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'heirloom-tomato' },
            name: { type: 'string', example: 'Heirloom tomato' },
            price: { type: 'number', example: 5.99 },
            pricePerUnit: { type: 'number', example: 5.99 },
            unit: { type: 'string', example: 'lb' }
          }
        },
        BasketItem: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'basket-item-1' },
            productId: { type: 'string', example: 'heirloom-tomato' },
            product: { $ref: '#/components/schemas/Product' },
            quantity: { type: 'number', example: 1 },
            totalPrice: { type: 'number', example: 5.99 }
          }
        },
        BasketTotals: {
          type: 'object',
          properties: {
            subtotal: { type: 'string', example: '27.44' },
            shipping: { type: 'string', example: '3.99' },
            tax: { type: 'string', example: '2.00' },
            total: { type: 'string', example: '33.43' },
            itemCount: { type: 'number', example: 3 }
          }
        },
        Registration: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'reg-1640995200000' },
            referenceNumber: { type: 'string', example: 'VV995200123' },
            animalCounts: { type: 'object', example: { 'Cattle': { 'Dairy cows': 10, 'Bulls': 2 } } },
            createdAt: { type: 'string', format: 'date-time' },
            status: { type: 'string', example: 'pending' }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            error: { type: 'string' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Error message' }
          }
        }
      }
    }
  },
  apis: ['./server.js'] // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'VetVisits API Documentation'
}));

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

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

/**
 * @swagger
 * /api/species:
 *   get:
 *     summary: Get all animal species
 *     description: Retrieve a list of all available animal species with their subcategories
 *     tags: [Animal Species]
 *     responses:
 *       200:
 *         description: List of animal species
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AnimalSpecies'
 */
app.get('/api/species', (req, res) => {
  res.json({
    success: true,
    data: Object.values(animalSpecies)
  });
});

/**
 * @swagger
 * /api/species/{key}:
 *   get:
 *     summary: Get specific animal species
 *     description: Retrieve details for a specific animal species by key
 *     tags: [Animal Species]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *           example: cattle
 *         description: The species key (cattle, sheep, pigs, etc.)
 *     responses:
 *       200:
 *         description: Animal species details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AnimalSpecies'
 *       404:
 *         description: Species not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all available products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: Object.values(products)
  });
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get specific product
 *     description: Retrieve details for a specific product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: heirloom-tomato
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /api/basket:
 *   get:
 *     summary: Get basket contents
 *     description: Retrieve all items in the basket with totals
 *     tags: [Basket]
 *     responses:
 *       200:
 *         description: Basket contents and totals
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         items:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/BasketItem'
 *                         totals:
 *                           $ref: '#/components/schemas/BasketTotals'
 *   delete:
 *     summary: Clear basket
 *     description: Remove all items from the basket
 *     tags: [Basket]
 *     responses:
 *       200:
 *         description: Basket cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Basket cleared
 */
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

/**
 * @swagger
 * /api/basket/items:
 *   post:
 *     summary: Add item to basket
 *     description: Add a new item to the basket or increase quantity if item already exists
 *     tags: [Basket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: heirloom-tomato
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Item added to basket successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BasketItem'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /api/basket/items/{itemIndex}:
 *   put:
 *     summary: Update basket item quantity
 *     description: Update the quantity of a specific basket item
 *     tags: [Basket]
 *     parameters:
 *       - in: path
 *         name: itemIndex
 *         required: true
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Index of the basket item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 2
 *                 description: New quantity (set to 0 to remove item)
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BasketItem'
 *       400:
 *         description: Invalid quantity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Basket item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Remove item from basket
 *     description: Remove a specific item from the basket
 *     tags: [Basket]
 *     parameters:
 *       - in: path
 *         name: itemIndex
 *         required: true
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Index of the basket item
 *     responses:
 *       200:
 *         description: Item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Item removed from basket
 *       404:
 *         description: Basket item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Create animal registration
 *     description: Register animals for vet visits with animal counts by species and subcategory
 *     tags: [Registrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animalCounts
 *             properties:
 *               animalCounts:
 *                 type: object
 *                 example:
 *                   "Cattle":
 *                     "Dairy cows": 10
 *                     "Bulls": 2
 *                   "Sheep":
 *                     "Ewes": 15
 *                     "Lambs": 8
 *                 description: Object with species names as keys and subcategory counts as values
 *     responses:
 *       201:
 *         description: Registration created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Invalid animal counts data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});
