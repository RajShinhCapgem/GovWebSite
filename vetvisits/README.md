# Vet Visits Registration Service

A Node.js Express application built with the GOV.UK Design System for farmers to register animals for veterinary visits.

## Features

- **Start page** with service information and prominent "Start now" button
- **Species selection** with checkboxes for different animal types
- **Animal counting** with input fields for each subcategory
- **Confirmation page** with registration reference and summary
- **Validation** and error handling following GOV.UK patterns
- **Accessibility** compliant with WCAG 2.2 AA standards
- **Responsive design** that works on all devices

## Animal Species Supported

- **Cattle**: Bulls, Cows, Heifers, Calves
- **Sheep**: Rams, Ewes, Lambs  
- **Pigs**: Boars, Sows, Piglets
- **Poultry**: Chickens, Ducks, Geese, Turkeys
- **Horses**: Stallions, Mares, Geldings, Foals

## Prerequisites

- Node.js (version 14 or higher)
- npm

## Installation

1. Navigate to the vetvisits directory:
   ```
   cd vetvisits
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Development mode (with auto-restart):
```
npm run dev
```

### Production mode:
```
npm start
```

The application will run on http://localhost:3000

## Project Structure

```
vetvisits/
├── app.js              # Main Express application
├── package.json        # Dependencies and scripts
├── views/              # Nunjucks templates
│   ├── base.html       # Base template with GOV.UK header/footer
│   ├── start.html      # Start page
│   ├── species-selection.html  # Species selection form
│   ├── animal-counts.html      # Animal counting form
│   ├── confirmation.html       # Success confirmation
│   ├── 404.html        # Page not found
│   └── 500.html        # Server error
└── public/             # Static assets (if needed)
```

## Key Features

### Accessibility
- Proper heading hierarchy (h1 → h6)
- Skip links for keyboard navigation
- ARIA labels and descriptions
- Screen reader compatible
- High contrast compliance

### Form Validation
- Server-side validation
- Error summary at top of pages
- Individual field error messages
- Maintains user input on validation errors

### User Experience
- Progressive enhancement
- Clear navigation with back links
- Helpful hint text and guidance
- Reference numbers for tracking

### GOV.UK Design System Compliance
- Uses govuk-frontend v5.10.0+
- Correct asset paths configuration
- Standard GOV.UK components and patterns
- Official GOV.UK styling and behavior

## Development Notes

### Nunjucks Templates
- Uses standard Nunjucks filters only (no advanced filters)
- String manipulation done with built-in filters like `lower`, `replace`
- Date/time generation handled in Express routes, not templates
- Field naming consistent between templates and JavaScript

### Error Handling
- Comprehensive validation for all form inputs
- User-friendly error messages
- Proper error state styling
- Graceful fallbacks for system errors

### Configuration
- Static file serving configured for GOV.UK Frontend
- Nunjucks configured with autoescape and watch mode
- Body parser for form submission handling

## Browser Support

Supports all modern browsers and assistive technologies as per GOV.UK Service Standard.

## Contributing

Follow GOV.UK Design System guidelines and coding standards. Test with:
- Keyboard navigation only
- Screen readers
- Different viewport sizes
- HTML validation

## License

MIT
