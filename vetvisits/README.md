# Vet Visits - Animal Registration Service

A GOV.UK Design System compliant Node.js Express application for farmers to register animals for veterinary visits.

## Features

- GOV.UK Design System compliant interface
- Multi-step form for animal registration
- Species selection with checkboxes
- Animal count input by subcategories
- Form validation and error handling
- Session management
- Confirmation page with summary
- Responsive design
- Accessibility features

## Animal Categories

The application supports registration for:

### Cattle
- Dairy cows
- Beef cattle  
- Bulls
- Calves

### Sheep
- Ewes
- Rams
- Lambs
- Wethers

### Pigs
- Breeding sows
- Boars
- Piglets
- Finishing pigs

### Poultry
- Laying hens
- Broiler chickens
- Ducks
- Geese
- Turkeys

## Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd vetvisits
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the application with automatic reloading when files change.

### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
vetvisits/
├── app.js                 # Main application file
├── package.json          # Dependencies and scripts
├── views/                # Nunjucks templates
│   ├── layout.njk        # Base layout template
│   ├── index.njk         # Start page
│   ├── species-selection.njk # Species selection form
│   ├── animal-counts.njk # Animal count input form
│   └── confirmation.njk  # Confirmation page
├── public/               # Static assets
│   └── css/
│       ├── govuk-frontend.min.css # GOV.UK Frontend styles
│       └── application.css        # Custom styles
└── README.md
```

## User Journey

1. **Start Page** (`/`) - Introduction and service overview
2. **Species Selection** (`/species-selection`) - Select animal species using checkboxes
3. **Animal Counts** (`/animal-counts`) - Enter counts for each animal subcategory
4. **Confirmation** (`/confirmation`) - Review and confirm registration

## Technical Details

- **Framework**: Express.js
- **Template Engine**: Nunjucks
- **Design System**: GOV.UK Frontend v5.7.0
- **Session Management**: express-session
- **Form Handling**: body-parser
- **Validation**: Server-side validation with error display

## Common Development Issues

### Nunjucks Filter Syntax
**Issue**: Using Python-style method calls instead of Nunjucks filters
```
❌ Incorrect: {{ variable.lower() }}
✅ Correct:   {{ variable | lower }}
```

**Fixed locations**:
- `views/animal-counts.njk` line 44: `{{ subcategory.name | lower }}`
- `views/confirmation.njk` line 35: `{{ species.name | lower }}`

**Remember**: Nunjucks uses pipe (`|`) syntax for filters, not method calls with parentheses.

## Accessibility

The application follows GOV.UK Design System accessibility standards:
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Error message association
- Proper form labeling
- Focus management

## Browser Support

Supports all modern browsers as per GOV.UK Frontend requirements:
- Chrome 55+
- Firefox 45+
- Safari 12+
- Edge 79+
- Internet Explorer 11

## Development

The application uses:
- Nunjucks for server-side templating
- GOV.UK Frontend components and patterns
- Express sessions for multi-step form data
- Comprehensive form validation
- Error handling and user feedback

## Customization

To modify animal categories, update the `animalData` object in `app.js`. The structure should maintain the same format with species and subcategories.

## Production Deployment

Before deploying to production:
1. Set `NODE_ENV=production`
2. Configure proper session secrets
3. Enable HTTPS and set secure cookies
4. Set up proper error logging
5. Configure security headers

## License

This project is licensed under the MIT License.
