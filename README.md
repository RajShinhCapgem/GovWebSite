# Vet Visits - Animal Registration Service

A Node.js Express application built with the GOV.UK Design System for farmers to register animals for veterinary visits.

## Features

- **GOV.UK Design System**: Fully compliant with government digital service standards
- **Accessible**: WCAG 2.1 Level AA compliant
- **Responsive**: Mobile-first design that works on all devices
- **Form Validation**: Comprehensive client and server-side validation
- **Error Handling**: User-friendly error messages with GOV.UK error summary

## Requirements

- Node.js (version 16 or higher)
- npm (Node Package Manager)

## Installation

1. **Clone or download this repository**

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Start the application**:
   ```powershell
   npm start
   ```

4. **For development** (with auto-restart):
   ```powershell
   npm run dev
   ```

5. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
vetvisits/
├── app.js                 # Main Express application
├── package.json           # Project dependencies and scripts
├── public/                # Static assets (CSS, JS, images)
├── views/                 # EJS templates
│   ├── index.ejs         # Main registration form
│   └── success.ejs       # Success confirmation page
└── README.md             # This file
```

## Form Fields

The registration form includes the following fields with full validation:

1. **Animal Type** (Radio buttons)
   - Cattle
   - Sheep
   - Pigs
   - Other

2. **Animal ID** (Text input)
   - Ear tag number or identifier
   - 2-20 characters required

3. **Farm Postcode** (Text input)
   - Valid UK postcode format
   - Example: SW1A 1AA

4. **Visit Date** (Date input)
   - Day, month, year components
   - Must be current year or next year

5. **Contact Phone** (Tel input)
   - UK phone number format
   - Mobile or landline accepted

## Validation

### Client-side
- HTML5 validation attributes
- Progressive enhancement with JavaScript

### Server-side
- Express-validator middleware
- Comprehensive error handling
- Form data persistence on validation errors

## Accessibility Features

- **Skip links** for keyboard navigation
- **Screen reader** compatible
- **High contrast** color scheme
- **Semantic HTML** structure
- **ARIA labels** and roles
- **Error announcements** for assistive technology

## GOV.UK Design System Components Used

- **Header** with crown logo and service name
- **Footer** with standard government links
- **Form groups** with proper labeling
- **Radio buttons** for animal type selection
- **Text inputs** with hint text
- **Date input** component
- **Error summary** for validation feedback
- **Panel** for success confirmation
- **Summary list** for data display
- **Button** with proper styling

## Browser Support

- Internet Explorer 11+
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest version)
- Mobile browsers on iOS and Android

## Development Notes

### Adding New Features

When extending this application:

1. **Always use GOV.UK components** - Don't create custom equivalents
2. **Follow accessibility guidelines** - Test with screen readers
3. **Maintain responsive design** - Test on mobile devices
4. **Use semantic HTML** - Proper heading hierarchy
5. **Include proper validation** - Both client and server-side

### Styling Guidelines

- Use only GOV.UK approved colors
- Follow the design system typography scale
- Maintain proper spacing with GOV.UK classes
- Use the grid system for layout

### Testing

Before deployment, test:

- [ ] Form submission with valid data
- [ ] Form validation with invalid data
- [ ] Error summary functionality
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

## Security Considerations

- Form data is validated on both client and server
- No sensitive data is stored or logged
- HTTPS should be used in production
- Regular security updates for dependencies

## Performance

- Optimized GOV.UK Frontend assets
- Minimal JavaScript for progressive enhancement
- Efficient form validation
- Mobile-optimized loading

## Deployment

For production deployment:

1. Set environment variables:
   ```
   NODE_ENV=production
   PORT=3000
   ```

2. Use a process manager like PM2:
   ```powershell
   npm install -g pm2
   pm2 start app.js --name vetvisits
   ```

3. Configure reverse proxy (nginx/Apache)
4. Enable HTTPS with SSL certificates
5. Set up monitoring and logging

## Support

For technical support or questions about this implementation:

- Check the [GOV.UK Design System documentation](https://design-system.service.gov.uk/)
- Review the [Government Service Manual](https://www.gov.uk/service-manual)
- Follow [accessibility guidelines](https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps)

## License

This project is licensed under the MIT License - see the [package.json](package.json) file for details.

## Contributing

When contributing to this project:

1. Follow the GOV.UK Design System guidelines
2. Ensure all changes maintain accessibility standards
3. Test across supported browsers and devices
4. Update documentation as needed
5. Include appropriate validation for new features
