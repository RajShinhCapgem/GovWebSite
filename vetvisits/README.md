# Veterinary Visits - Animal Registration Service

A single-page Node.js Express application using the GOV.UK Design System for farmers to register animals for veterinary visits.

## Features

- **GOV.UK Design System Compliance**: Built using official GOV.UK Frontend components and patterns
- **Accessibility**: WCAG 2.1 Level AA compliant with proper semantic HTML and ARIA labels
- **Form Validation**: Server-side validation with user-friendly error messages
- **Responsive Design**: Mobile-first design that works across all devices
- **Animal Species Support**: Supports cattle, sheep, pigs, poultry, horses, goats, and other animals
- **Confirmation Page**: Clear success confirmation with next steps

## Getting Started

### Prerequisites

- Node.js 16.x or higher (18.x+ recommended)
- npm 8.x or higher

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd vetvisits
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit: http://localhost:3000

### Production

To run in production mode:
```bash
npm start
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload
- `npm test` - Run accessibility and unit tests
- `npm run test:accessibility` - Run accessibility tests only
- `npm run test:unit` - Run unit tests only

## Application Structure

```
vetvisits/
├── app.js                 # Main Express application
├── package.json           # Dependencies and scripts
├── views/
│   └── index.ejs         # Main page template
├── public/               # Static assets (currently empty)
└── node_modules/
    └── govuk-frontend/   # GOV.UK Frontend package
```

## Form Validation

The application includes comprehensive validation:

- **Species Selection**: Must select one of the available animal types
- **Animal Count**: Must be a number between 1 and 10,000

All validation follows GOV.UK Design System patterns with:
- Error summary at the top of the page
- Individual field error messages
- Proper ARIA associations for screen readers

## GOV.UK Design System Components Used

- **Header**: With crown logo and service name
- **Footer**: Standard government footer with licensing information
- **Form Groups**: Proper field grouping with labels and hints
- **Radio Buttons**: For species selection
- **Text Input**: For animal count
- **Error Summary**: For validation errors
- **Confirmation Panel**: For successful submissions
- **Button**: Primary action button

## Accessibility Features

- Skip link for keyboard navigation
- Proper heading hierarchy
- ARIA labels and descriptions
- Error announcement for screen readers
- High contrast color scheme
- Touch-friendly interaction areas

## Browser Support

This application supports all modern browsers and follows GOV.UK Frontend browser support policy:
- Internet Explorer 11+
- Edge (latest 2 versions)
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## License

This project uses the GOV.UK Frontend under the MIT License.
