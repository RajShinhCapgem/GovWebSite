# Veterinary Visits Registration Service

A GOV.UK Design System compliant Node.js Express application for farmers to register animals for veterinary visits.

## Features

- **GOV.UK Design System**: Fully compliant with GOV.UK Design System v5.10.0+
- **Accessibility**: WCAG 2.2 AA compliant with proper semantic HTML and ARIA labels
- **Multi-step Form**: Species selection followed by detailed animal counts
- **Validation**: Server-side form validation with user-friendly error messages
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Animal Species Supported

- **Cattle**: Dairy cows, Beef cattle, Bulls, Calves
- **Sheep**: Ewes, Rams, Lambs, Wethers
- **Pigs**: Sows, Boars, Piglets, Finisher pigs
- **Poultry**: Chickens, Ducks, Geese, Turkeys
- **Horses**: Mares, Stallions, Geldings, Foals

## Installation

1. **Clone and navigate to the project directory:**
   ```bash
   cd vetvisits
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## Project Structure

```
vetvisits/
├── app.js                 # Main Express application
├── package.json           # Dependencies and scripts
├── views/                 # Nunjucks templates
│   ├── layout.html        # Base layout template
│   ├── start.html         # Start page
│   ├── species-selection.html  # Species selection form
│   ├── animal-counts.html # Animal counts form
│   ├── confirmation.html  # Registration confirmation
│   └── 404.html          # Error page
└── README.md             # This file
```

## Key Design Decisions

### GOV.UK Design System Compliance
- Uses govuk-frontend v5.10.0+ with correct asset paths
- Implements proper GOV.UK header, footer, and phase banner
- Follows GOV.UK form patterns and error handling
- Uses appropriate GOV.UK typography and spacing

### Accessibility Features
- Semantic HTML5 structure
- Proper heading hierarchy (h1 → h6)
- ARIA labels and descriptions
- Skip links for keyboard navigation
- Error summaries with focus management
- High contrast colors meeting WCAG standards

### Nunjucks Template Best Practices
- Uses standard Nunjucks filters (lower, replace, join)
- Avoids advanced filters not available in standard Nunjucks
- Uses loops and conditionals for complex data manipulation
- Consistent field naming between JavaScript and templates

### Form Validation
- Server-side validation for all inputs
- Clear, actionable error messages
- Maintains form state on validation errors
- Follows GOV.UK error handling patterns

## API Endpoints

- `GET /` - Start page
- `GET /species-selection` - Species selection form
- `POST /species-selection` - Process species selection
- `GET /animal-counts` - Animal counts form
- `POST /animal-counts` - Process animal counts and show confirmation

## Dependencies

- **express**: Web framework for Node.js
- **nunjucks**: Template engine
- **govuk-frontend**: GOV.UK Design System components
- **body-parser**: Parse incoming request bodies

## Development

The application follows Express.js best practices and GOV.UK service standards:

- Environment variables for configuration
- Proper error handling and 404 pages
- RESTful routing patterns
- Session management for multi-step forms
- Responsive design for all devices

## Testing

The application should be tested with:
- Keyboard navigation only
- Screen readers (NVDA, JAWS, VoiceOver)
- Multiple browsers and devices
- W3C HTML validation
- WCAG 2.2 AA compliance checking

## Contributing

When making changes:
1. Follow GOV.UK Design System guidelines
2. Maintain WCAG 2.2 AA compliance
3. Test with assistive technologies
4. Use semantic HTML and proper ARIA labels
5. Follow Nunjucks template best practices
