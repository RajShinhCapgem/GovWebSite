# VetVisits API

RESTful API service for the VetVisits application providing data for animal species, products, basket management, and registration services.

## Installation

1. Navigate to the API directory:
   ```bash
   cd vetvisits-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the API server:
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /health` - API health status

### Animal Species
- `GET /api/species` - Get all animal species
- `GET /api/species/:key` - Get specific species by key

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product by ID

### Basket Management
- `GET /api/basket` - Get basket contents and totals
- `POST /api/basket/items` - Add item to basket
- `PUT /api/basket/items/:itemIndex` - Update basket item quantity
- `DELETE /api/basket/items/:itemIndex` - Remove item from basket
- `DELETE /api/basket` - Clear entire basket

### Animal Registration
- `POST /api/registrations` - Create new animal registration

## Example Requests

### Get all species
```bash
curl http://localhost:3001/api/species
```

### Get basket contents
```bash
curl http://localhost:3001/api/basket
```

### Add item to basket
```bash
curl -X POST http://localhost:3001/api/basket/items \
  -H "Content-Type: application/json" \
  -d '{"productId": "heirloom-tomato", "quantity": 2}'
```

### Update basket item
```bash
curl -X PUT http://localhost:3001/api/basket/items/0 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
```

### Create animal registration
```bash
curl -X POST http://localhost:3001/api/registrations \
  -H "Content-Type: application/json" \
  -d '{"animalCounts": {"Cattle": {"Bulls": 5, "Cows": 20}}}'
```

## Data Models

### Species
```json
{
  "name": "Cattle",
  "key": "cattle",
  "subcategories": ["Dairy cows", "Beef cattle", "Bulls", "Calves"]
}
```

### Product
```json
{
  "id": "heirloom-tomato",
  "name": "Heirloom tomato",
  "price": 5.99,
  "pricePerUnit": 5.99,
  "unit": "lb"
}
```

### Basket Item
```json
{
  "id": "basket-item-1",
  "productId": "heirloom-tomato",
  "product": { /* product object */ },
  "quantity": 1,
  "totalPrice": 5.99
}
```

## Security

- CORS enabled for cross-origin requests
- Helmet.js for basic security headers
- Input validation on all endpoints
- Error handling middleware

## Configuration

The API runs on port 3001 by default. To change the port, set the `PORT` environment variable:

```bash
PORT=3002 npm start
```
