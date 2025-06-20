# Vetvisits - Register Animals for Vet Visits

A GOV.UK Design System compliant Node.js Express application for farmers to register animals for vet visits.

## Features

- **Species Selection**: Choose from cattle, sheep, pigs, poultry, goats, or horses
- **Animal Count Entry**: Enter specific numbers for subcategories (e.g., ewes, rams, lambs for sheep)
- **Form Validation**: Server-side validation with clear error messages
- **Confirmation**: Summary page showing registered animals
- **Accessibility**: WCAG 2.1 Level AA compliant
- **GOV.UK Design System**: Full compliance with government service standards

## Animal Categories Supported

### Cattle
- Dairy cows, Beef cattle, Bulls, Calves

### Sheep  
- Ewes, Rams, Lambs, Wethers

### Pigs
- Sows, Boars, Piglets, Gilts

### Poultry
- Laying hens, Broilers, Roosters, Chicks

### Goats
- Does, Bucks, Kids, Wethers

### Horses
- Mares, Stallions, Geldings, Foals

## Installation

### Prerequisites
- Node.js 16.x or higher (18.x+ recommended)
- npm 8.x or higher

### Setup

1. **Clone/Download the project**
   ```bash
   cd vetvisits
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify GOV.UK Frontend assets**
   ```bash
   # Check required files exist
   dir node_modules\govuk-frontend\dist\govuk\govuk-frontend.min.css
   dir node_modules\govuk-frontend\dist\govuk\govuk-frontend.min.js
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the application**
   Open http://localhost:3000 in your browser

## Development

### Development server with auto-restart
```bash
npm run dev
```

### Testing
```bash
# Run all tests
npm test

# Accessibility testing
npm run test:accessibility

# Unit tests
npm run test:unit
```

## Project Structure

```
vetvisits/
├── app.js                 # Main Express application
├── package.json           # Dependencies and scripts
├── package-lock.json      # Dependency lock file
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── views/                # EJS templates
│   ├── species-selection.ejs    # Animal species selection page
│   ├── animal-count.ejs         # Animal count entry page
│   ├── confirmation.ejs         # Registration confirmation
│   └── includes/               # Reusable components
│       └── layout.ejs          # Base template layout
├── public/               # Static assets (empty - using GOV.UK assets)
└── node_modules/         # Dependencies
    └── govuk-frontend/   # GOV.UK Frontend package
```

## Key Dependencies

- **express**: Web application framework
- **ejs**: Templating engine
- **govuk-frontend**: Official GOV.UK Design System components
- **body-parser**: Form data parsing
- **express-validator**: Server-side form validation

## Design Standards

This application follows the GOV.UK Design System:

- **Accessibility**: WCAG 2.1 Level AA compliant
- **Typography**: GOV.UK Transport font
- **Colors**: Government approved color palette
- **Components**: Official GOV.UK Frontend components
- **Patterns**: Government service design patterns
- **One question per page**: Follows GDS pattern for complex forms

## Browser Support

Supports all modern browsers as per GOV.UK Frontend compatibility:
- Internet Explorer 11+
- Edge (all versions)
- Chrome (all versions)
- Firefox (all versions)
- Safari 9+

## Government Design Principles

This service follows the Government Design Principles:
- Start with user needs
- Do less - focus on essential features
- Design with data and user research
- Do the hard work to make it simple
- Iterate based on user feedback
- Make things open and accessible
- Understand context and constraints
- Build digital services, not websites
- Be consistent, not uniform
- Make things accessible and inclusive

## License

MIT License - This project is open source and free to use.

## Support

For issues or questions:
1. Check the browser console for JavaScript errors
2. Ensure GOV.UK Frontend assets are loading correctly
3. Verify form validation is working as expected
4. Test accessibility with screen readers

## Contributing

When making changes:
1. Follow GOV.UK Design System guidelines
2. Test accessibility compliance
3. Ensure mobile-first responsive design
4. Validate all forms server-side
5. Use semantic HTML structure
