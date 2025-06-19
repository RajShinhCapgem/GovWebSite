# GOV.UK Design System - Development Instructions

## Overview
This application MUST follow the GOV.UK Design System standards to ensure consistency with government services. All code should use the official GOV.UK Frontend components, styles, and patterns.

## Installation & Setup

### Required Dependencies
- **Primary**: `govuk-frontend` (latest version 5.10.2+)
- **Installation**: `npm install govuk-frontend`
- **License**: MIT License - publicly available and free to use

### Build Setup
1. Import GOV.UK Frontend CSS and JavaScript
2. Initialize all components with `GOVUKFrontend.initAll()`
3. Include assets (fonts, images) from the govuk-frontend package
4. Use the GOV.UK template structure as base

### Express.js/Node.js Specific Setup

#### Required Dependencies for Node.js Projects
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "ejs": "^3.1.9",
    "govuk-frontend": "^5.10.2",
    "body-parser": "^1.20.2",
    "express-validator": "^7.0.1"
  }
}
```

#### Critical Asset Path Configuration
**MUST** configure Express static middleware correctly to serve GOV.UK Frontend assets:

```javascript
const path = require('path');

// Serve GOV.UK Frontend assets - CRITICAL PATH
app.use('/govuk-frontend', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist')));
```

#### Template Asset Links (EJS/HTML)
**EXACT** paths required for CSS and JavaScript:

```html
<!-- CSS - Use this exact path -->
<link href="/govuk-frontend/govuk/govuk-frontend.min.css" rel="stylesheet">

<!-- JavaScript - Use this exact path -->
<script src="/govuk-frontend/govuk/govuk-frontend.min.js"></script>
<script>
  window.GOVUKFrontend.initAll()
</script>
```

#### Middleware Order (Critical)
```javascript
// 1. Body parser FIRST
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Static files (your public folder)
app.use(express.static('public'));

// 3. GOV.UK Frontend assets
app.use('/govuk-frontend', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist')));

// 4. Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
```

## Development Environment Requirements

### Node.js Setup
- **Node.js Version**: 16.x or higher (18.x+ recommended)
- **npm Version**: 8.x or higher
- **Package Manager**: npm (yarn also supported)

### Project Structure Recommendations
```
project-root/
├── app.js                 # Main Express application
├── package.json           # Dependencies and scripts
├── package-lock.json      # Dependency lock file
├── views/                 # EJS templates
│   ├── index.ejs         # Main pages
│   └── includes/         # Reusable components
├── public/               # Static assets
│   ├── css/             # Custom CSS (minimal)
│   ├── js/              # Custom JavaScript
│   └── images/          # Images and icons
├── routes/              # Express routes
├── middleware/          # Custom middleware
└── node_modules/        # Dependencies (auto-generated)
    └── govuk-frontend/  # GOV.UK Frontend package
```

### Development Scripts
Add to package.json:
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "npm run test:accessibility && npm run test:unit",
    "test:accessibility": "axe-cli http://localhost:3000",
    "test:unit": "jest"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "axe-cli": "^4.8.2",
    "jest": "^29.7.0"
  }
}
```

### Environment Configuration
Create `.env` file for environment variables:
```
NODE_ENV=development
PORT=3000
SESSION_SECRET=your-secret-key-here
```

### Git Configuration
Essential `.gitignore` entries:
```
# Dependencies
node_modules/
npm-debug.log*

# Environment variables
.env
.env.local
.env.production

# Logs
logs/
*.log

# Runtime data
pids/
*.pid

# Coverage directory
coverage/

# Build outputs
dist/
build/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
```

## Core Principles

### Government Design Principles
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

### Accessibility Requirements
- MUST meet WCAG 2.1 Level AA standards
- All components are pre-tested for accessibility
- Use semantic HTML structure
- Ensure proper color contrast
- Include proper ARIA labels and roles
- Test with screen readers and keyboard navigation

## Styling Guidelines

### Typography
- Use GOV.UK Transport font (included in govuk-frontend)
- Font sizes: Use predefined size classes (govuk-heading-xl, govuk-heading-l, etc.)
- Line heights and spacing follow GOV.UK standards
- Body text: 19px (desktop), 16px (mobile)

### Colors
Use only GOV.UK approved colors:
- **Primary**: Blue (#1d70b8)
- **Secondary**: Dark Grey (#505a5f)
- **Success**: Green (#00703c)
- **Warning**: Yellow (#ffbf47)  
- **Error**: Red (#d4351c)
- **Focus**: Yellow (#ffdd00)
- **Text**: Black (#0b0c0c)
- **Background**: White (#ffffff)
- **Border**: Mid Grey (#b1b4b6)

### Layout
- Use GOV.UK grid system (govuk-grid-row, govuk-grid-column)
- Mobile-first responsive design
- Maximum page width: 1020px
- Standard margins and padding using GOV.UK spacing scale
- Two-thirds/one-third column layout for content

## Components to Use

### Form Components
- **Text Input**: `govuk-input` for single-line text
- **Textarea**: `govuk-textarea` for multi-line text
- **Select**: `govuk-select` for dropdown lists
- **Radios**: `govuk-radios` for single selection
- **Checkboxes**: `govuk-checkboxes` for multiple selection
- **Date Input**: `govuk-date-input` for date entry
- **File Upload**: `govuk-file-upload` for file selection
- **Button**: `govuk-button` with proper styling and states

### Navigation Components
- **Header**: `govuk-header` with crown logo and service name
- **Footer**: `govuk-footer` with standard government links
- **Breadcrumbs**: `govuk-breadcrumbs` for navigation hierarchy
- **Pagination**: `govuk-pagination` for multi-page content
- **Service Navigation**: `govuk-service-navigation` for internal navigation
- **Skip Link**: `govuk-skip-link` for accessibility

### Content Components
- **Panel**: `govuk-panel` for confirmation messages
- **Notification Banner**: `govuk-notification-banner` for important messages
- **Warning Text**: `govuk-warning-text` for critical information
- **Details**: `govuk-details` for collapsible content
- **Accordion**: `govuk-accordion` for grouped collapsible sections
- **Summary List**: `govuk-summary-list` for key-value pairs
- **Table**: `govuk-table` for tabular data
- **Tag**: `govuk-tag` for status indicators
- **Tabs**: `govuk-tabs` for content organization

### Error Handling
- **Error Summary**: `govuk-error-summary` at top of page
- **Error Message**: `govuk-error-message` for individual fields
- **Field Validation**: Use `govuk-form-group--error` wrapper
- **Error State**: Add `govuk-input--error` to inputs

## Pattern Implementation

### Common Patterns
- **Addresses**: Use established address pattern for UK addresses
- **Bank Details**: Follow bank account pattern for sort codes/account numbers
- **Names**: Use single name field unless legally required to separate
- **Phone Numbers**: Single field with international format guidance
- **Email Addresses**: Standard email input with validation
- **Dates**: Use date input component with clear labeling
- **Question Pages**: One question per page principle
- **Check Your Answers**: Summary page before submission
- **Confirmation Pages**: Success page after form submission

### Form Patterns
```html
<!-- Standard form structure -->
<div class="govuk-form-group">
  <label class="govuk-label" for="field-name">
    Label text
  </label>
  <div id="field-name-hint" class="govuk-hint">
    Hint text if needed
  </div>
  <input class="govuk-input" id="field-name" name="field-name" type="text">
</div>
```

### Template Integration Patterns

#### EJS Template Structure
```html
<!DOCTYPE html>
<html lang="en" class="govuk-template">
<head>
  <meta charset="utf-8">
  <title><%= title %> - Service name - GOV.UK</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b0c0c">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <!-- GOV.UK Frontend assets -->
  <link href="/govuk-frontend/govuk/govuk-frontend.min.css" rel="stylesheet">
</head>

<body class="govuk-template__body">
  <script>document.body.className = 'js-enabled' + ' ' + document.body.className;</script>
  
  <!-- Skip link for accessibility -->
  <a href="#main-content" class="govuk-skip-link" data-module="govuk-skip-link">Skip to main content</a>

  <!-- Header -->
  <header class="govuk-header" role="banner" data-module="govuk-header">
    <!-- Header content -->
  </header>

  <!-- Main content -->
  <div class="govuk-width-container">
    <main class="govuk-main-wrapper" id="main-content" role="main">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          
          <!-- Error summary (if errors exist) -->
          <% if (errors && errors.length > 0) { %>
          <div class="govuk-error-summary" data-module="govuk-error-summary">
            <div role="alert">
              <h2 class="govuk-error-summary__title">There is a problem</h2>
              <div class="govuk-error-summary__body">
                <ul class="govuk-list govuk-error-summary__list">
                  <% errors.forEach(function(error) { %>
                  <li><a href="#<%= error.path %>"><%= error.msg %></a></li>
                  <% }); %>
                </ul>
              </div>
            </div>
          </div>
          <% } %>

          <!-- Page content -->
          
        </div>
      </div>
    </main>
  </div>

  <!-- Footer -->
  <footer class="govuk-footer" role="contentinfo">
    <!-- Footer content -->
  </footer>

  <!-- GOV.UK Frontend JavaScript -->
  <script src="/govuk-frontend/govuk/govuk-frontend.min.js"></script>
  <script>window.GOVUKFrontend.initAll()</script>
</body>
</html>
```

#### Form Error Handling Pattern
```html
<!-- Form group with error handling -->
<div class="govuk-form-group <%= errors && errors.find(e => e.path === 'field-name') ? 'govuk-form-group--error' : '' %>">
  <label class="govuk-label govuk-label--m" for="field-name">
    Field Label
  </label>
  <div id="field-name-hint" class="govuk-hint">
    Hint text if needed
  </div>
  <% if (errors && errors.find(e => e.path === 'field-name')) { %>
  <p id="field-name-error" class="govuk-error-message">
    <span class="govuk-visually-hidden">Error:</span> <%= errors.find(e => e.path === 'field-name').msg %>
  </p>
  <% } %>
  <input class="govuk-input <%= errors && errors.find(e => e.path === 'field-name') ? 'govuk-input--error' : '' %>" 
         id="field-name" 
         name="field-name" 
         type="text" 
         value="<%= formData['field-name'] || '' %>"
         aria-describedby="field-name-hint <%= errors && errors.find(e => e.path === 'field-name') ? 'field-name-error' : '' %>">
</div>
```

#### Component Initialization
Always initialize GOV.UK components after DOM load:
```javascript
// At end of body tag
<script>
  // Initialize all GOV.UK components
  window.GOVUKFrontend.initAll()
  
  // Or initialize specific components
  // var buttons = document.querySelectorAll('[data-module="govuk-button"]')
  // buttons.forEach(function(button) {
  //   new GOVUKFrontend.Button(button)
  // })
</script>
```

## Common Pitfalls and Troubleshooting

### Asset Loading Issues
**Problem**: Styles not loading, plain HTML appearance
**Cause**: Incorrect asset paths or middleware configuration
**Solution**: 
1. Verify Express static middleware path: `node_modules/govuk-frontend/dist`
2. Check CSS link: `/govuk-frontend/govuk/govuk-frontend.min.css`
3. Check JavaScript link: `/govuk-frontend/govuk/govuk-frontend.min.js`
4. Restart server after path changes

### Directory Structure Validation
Verify your govuk-frontend package structure:
```
node_modules/govuk-frontend/
├── dist/
│   └── govuk/
│       ├── govuk-frontend.min.css
│       ├── govuk-frontend.min.js
│       └── assets/
└── package.json
```

### Template Integration Issues
**EJS Template Problems**:
- Always include `<!DOCTYPE html>` and `lang="en"`
- Use `class="govuk-template"` on `<html>` element
- Include JavaScript enablement script in `<body>`
- Initialize with `window.GOVUKFrontend.initAll()`

### Form Validation Integration
**Express-validator Integration**:
```javascript
// Server-side validation
const { body, validationResult } = require('express-validator');

const validateForm = [
  body('field-name')
    .notEmpty()
    .withMessage('Error message for field')
];

app.post('/submit', validateForm, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('template', {
      errors: errors.array(),
      formData: req.body
    });
  }
  // Process valid form
});
```

### Development Environment Issues
**Node.js Version**: Use Node.js 16+ for compatibility
**Port Conflicts**: Use `taskkill /F /IM node.exe` on Windows to clear ports
**Asset Caching**: Hard refresh (Ctrl+F5) after asset path changes

### Quick Verification Steps
After setup, verify:
1. ✅ Blue GOV.UK header with crown logo visible
2. ✅ Proper typography (Transport font)
3. ✅ Form elements styled correctly
4. ✅ Console shows no 404 errors for CSS/JS
5. ✅ `window.GOVUKFrontend` object exists in browser console

### Pre-Development Checklist
Before starting development, verify:
- [ ] Node.js 16+ installed
- [ ] `govuk-frontend` package installed
- [ ] Express static middleware configured correctly
- [ ] CSS/JS paths pointing to correct files
- [ ] Template engine (EJS) configured
- [ ] Error handling middleware in place

### Post-Development Validation
After implementing features, test:
- [ ] **Visual Check**: GOV.UK styling applied correctly
- [ ] **Console Check**: No 404 errors for assets in browser console
- [ ] **Accessibility Check**: Skip link, keyboard navigation work
- [ ] **Mobile Check**: Responsive design functions properly
- [ ] **Form Check**: Validation and error handling work
- [ ] **Performance Check**: Page loads under 2 seconds
- [ ] **Cross-browser Check**: Works in Chrome, Firefox, Safari, Edge

### Automated Testing Integration
```javascript
// Jest test example for GOV.UK components
describe('GOV.UK Integration', () => {
  test('should load GOV.UK Frontend styles', async () => {
    const response = await request(app)
      .get('/govuk-frontend/govuk/govuk-frontend.min.css')
      .expect(200);
    expect(response.headers['content-type']).toMatch(/css/);
  });

  test('should initialize GOV.UK components', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    expect(response.text).toContain('window.GOVUKFrontend.initAll()');
  });
});
```

## Code Standards

### HTML Requirements
- Use semantic HTML5 elements
- Include proper ARIA attributes where needed
- All form elements must have associated labels
- Use GOV.UK CSS classes exclusively for styling
- Maintain proper heading hierarchy (h1, h2, h3, etc.)

### CSS Guidelines
- Import GOV.UK Frontend CSS: `@import "node_modules/govuk-frontend/govuk/all"`
- Use utility classes provided by GOV.UK Frontend
- Avoid custom CSS unless absolutely necessary
- If custom CSS is needed, follow BEM methodology
- Maintain mobile-first responsive approach

### JavaScript Requirements
- Initialize GOV.UK components: `GOVUKFrontend.initAll()`
- Use progressive enhancement principles
- Ensure functionality works without JavaScript
- Follow GOV.UK JavaScript coding standards
- Include proper error handling

## Testing Requirements

### Accessibility Testing
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Keyboard navigation testing
- Color contrast validation
- WAVE or similar accessibility tool checks
- Manual testing with users who have disabilities

### Browser Support
- Internet Explorer 11+
- Chrome, Firefox, Safari (latest 2 versions)
- Edge (latest version)
- Mobile browsers on iOS and Android

### Device Testing
- Desktop: 1024px and above
- Tablet: 768px to 1023px  
- Mobile: 320px to 767px
- Test on actual devices when possible

## Content Guidelines

### Writing Style
- Follow GOV.UK content style guide
- Use plain English (aim for reading age 9)
- Front-load important information
- Use active voice
- Keep sentences under 25 words
- Use bullet points for lists
- Write helpful error messages

### Tone of Voice
- Helpful and reassuring
- Clear and direct
- Human, not robotic
- Appropriate to the context
- Inclusive language only

## Performance Standards

### Page Load Requirements
- First Contentful Paint: <1.5 seconds
- Largest Contentful Paint: <2.5 seconds  
- Cumulative Layout Shift: <0.1
- First Input Delay: <100ms

### Optimization
- Minimize HTTP requests
- Optimize images and assets
- Use GOV.UK Frontend's built-in optimization
- Enable gzip compression
- Implement proper caching headers

## Security Considerations

### Data Protection
- Follow GDPR requirements
- Implement proper form validation
- Use HTTPS for all connections
- Secure session management
- Regular security audits

### Privacy
- Clear privacy notices
- Cookie consent management
- Data retention policies
- User data deletion capabilities

## Documentation Requirements

### Code Documentation
- Comment complex logic
- Document component usage
- Include accessibility notes
- Provide setup instructions
- Maintain changelog

### User Documentation
- Help text for complex forms
- Clear instructions for each step
- Contact information for support
- Service availability information

## Quality Assurance

### Code Review Checklist
- [ ] Uses official GOV.UK components
- [ ] Follows accessibility standards
- [ ] Implements proper error handling
- [ ] Mobile responsive design
- [ ] Cross-browser compatibility
- [ ] Performance optimization
- [ ] Security best practices
- [ ] Content follows style guide

### Testing Checklist
- [ ] Automated accessibility testing
- [ ] Manual accessibility testing
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Performance testing
- [ ] Security testing
- [ ] User acceptance testing

## Resources and References

### Official Documentation
- GOV.UK Design System: https://design-system.service.gov.uk/
- GOV.UK Frontend GitHub: https://github.com/alphagov/govuk-frontend
- Government Design Principles: https://www.gov.uk/guidance/government-design-principles
- GOV.UK Service Manual: https://www.gov.uk/service-manual

### Community Resources
- GitHub Discussions for each component
- X-GOVUK community resources: https://x-govuk.github.io/
- GOV.UK Prototype Kit: https://prototype-kit.service.gov.uk/

### Accessibility Resources
- Web Content Accessibility Guidelines (WCAG 2.1)
- GOV.UK Accessibility Strategy
- Screen reader testing guidance

## Important Notes

1. **Always use official GOV.UK components** - Never create custom versions
2. **Test with real users** - Especially those with accessibility needs  
3. **Mobile-first approach** - Design for mobile, enhance for desktop
4. **Performance matters** - Government services must be fast and reliable
5. **Accessibility is mandatory** - Not optional for government services
6. **Consistency is key** - Users expect familiar patterns across government
7. **Content comes first** - Design serves the content, not vice versa
8. **Iterate based on user feedback** - Continuously improve based on research
9. **Security by design** - Build security in from the start
10. **Keep it simple** - Remove anything that doesn't serve user needs

Remember: The GOV.UK Design System exists to help you build accessible, user-centered government services. When in doubt, follow the existing patterns and components rather than creating new ones.