# Vet Visits - Animal Registration Service

A GOV.UK compliant web application for farmers to register animals for veterinary visits, built with Node.js, Express, and the GOV.UK Design System.

## Features

- **Start Page**: Introduction to the service with clear call-to-action
- **Species Selection**: Multi-select form for choosing animal types
- **Animal Counts**: Dynamic form for entering animal counts by subcategory
- **Check Answers**: Summary page for reviewing information
- **Confirmation**: Success page with reference number

## Technology Stack

- **Backend**: Node.js with Express.js
- **Templating**: Nunjucks
- **Frontend**: GOV.UK Frontend v5.10.0+
- **Styling**: GOV.UK Design System components and patterns

## GOV.UK Design System Compliance

This application strictly follows GOV.UK Design System standards:

- ✅ Uses official GOV.UK Frontend components
- ✅ Implements proper accessibility standards (WCAG 2.2 AA)
- ✅ Follows GOV.UK form patterns and validation
- ✅ Uses semantic HTML and proper ARIA attributes
- ✅ Implements error handling and summary patterns
- ✅ Mobile-responsive design
- ✅ Progressive enhancement approach

## Installation

1. **Clone or navigate to the project directory**
   ```powershell
   cd vetvisits
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Start the application**
   ```powershell
   npm start
   ```
   
   Or for development with auto-restart:
   ```powershell
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
vetvisits/
├── app.js              # Main Express application
├── package.json        # Dependencies and scripts
├── views/              # Nunjucks templates
│   ├── base.html       # Base template with GOV.UK layout
│   ├── start.html      # Service start page
│   ├── species-selection.html  # Animal species selection
│   ├── animal-counts.html      # Animal count input
│   ├── check-answers.html      # Review page
│   ├── confirmation.html       # Success confirmation
│   └── error.html      # Error page template
└── public/             # Static assets (if any)
```

## Animal Species Supported

The application supports registration for:

- **Cattle**: Dairy cows, Beef cattle, Bulls, Calves
- **Sheep**: Ewes, Rams, Lambs, Wethers  
- **Pigs**: Sows, Boars, Piglets, Finishing pigs
- **Poultry**: Laying hens, Broiler chickens, Ducks, Geese, Turkeys
- **Horses**: Mares, Stallions, Geldings, Foals

## User Journey

1. **Start**: User lands on service start page
2. **Species Selection**: Select animal types using checkboxes
3. **Animal Counts**: Enter specific counts for each subcategory
4. **Check Answers**: Review all information with change links
5. **Confirmation**: Receive reference number and next steps

## Validation

- Species selection is required
- Animal counts must be positive whole numbers
- Maximum count per animal type: 999,999
- Client-side input patterns and server-side validation
- Accessible error messages with error summary

## Accessibility Features

- Skip to main content link
- Proper heading hierarchy
- Form labels and fieldsets
- Error message association with ARIA
- Screen reader compatible
- Keyboard navigation support
- High contrast compliance

## Development Notes

- Session data is stored in memory (use proper session storage in production)
- Reference numbers are generated using timestamp + random string
- All GOV.UK Frontend assets are properly configured
- Error handling includes both validation and 404 pages
- Templates use Nunjucks filters for proper string manipulation

## Production Considerations

For production deployment:

1. Use a proper session store (Redis, database)
2. Add database for persistent storage
3. Implement proper logging
4. Add rate limiting and security headers
5. Set up SSL/HTTPS
6. Configure environment variables
7. Add monitoring and health checks

## License

MIT License - This is a demonstration application following GOV.UK Design System guidelines.
