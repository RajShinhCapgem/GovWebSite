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
    "test:accessibility": "@axe-core/cli http://localhost:3000",
    "test:unit": "jest"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "@axe-core/cli": "^4.8.2",
    "jest": "^29.7.0"
  }
}
```

**CRITICAL**: Use `@axe-core/cli` not `axe-cli` - the latter package is deprecated and will cause installation failures.

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

## CRITICAL: Pre-Setup Verification
Before starting any development, verify these essential steps to avoid setup failures:

### Dependency Version Compatibility Check
**MUST USE CORRECT PACKAGE NAMES**:
- ❌ `axe-cli` (deprecated, causes npm install failures)  
- ✅ `@axe-core/cli` (current package)

### Required Setup Verification Commands
Run these commands IN ORDER before development:

```bash
# 1. Verify Node.js version (must be 16+)
node --version

# 2. Verify npm version (must be 8+)
npm --version

# 3. Create project and install dependencies with EXACT package names
npm init -y
npm install express@^4.18.2 ejs@^3.1.9 govuk-frontend@^5.10.2 body-parser@^1.20.2 express-validator@^7.0.1
npm install --save-dev nodemon@^3.0.2 @axe-core/cli@^4.8.2 jest@^29.7.0

# 4. Verify GOV.UK Frontend installed correctly
ls node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css
ls node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js

# 5. Test basic Express setup
npm start

# 6. Check browser at http://localhost:3000 for proper GOV.UK styling
```

### Critical File Structure Verification
After installation, verify this EXACT structure exists:
```
node_modules/govuk-frontend/
├── dist/
│   └── govuk/
│       ├── govuk-frontend.min.css  (MUST EXIST)
│       ├── govuk-frontend.min.js   (MUST EXIST)
│       └── assets/
└── package.json
```

### Middleware Configuration Requirements
**EXACT ORDER REQUIRED** in app.js:
```javascript
// 1. Body parser FIRST (before any routes)
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Static files (your public folder)
app.use(express.static('public'));

// 3. GOV.UK Frontend assets - EXACT PATH REQUIRED
app.use('/govuk-frontend', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist')));

// 4. Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
```

### Template Asset Paths (CANNOT BE CHANGED)
```html
<!-- CSS - EXACT PATH -->
<link href="/govuk-frontend/govuk/govuk-frontend.min.css" rel="stylesheet">

<!-- JavaScript - EXACT PATH -->
<script src="/govuk-frontend/govuk/govuk-frontend.min.js"></script>
<script>window.GOVUKFrontend.initAll()</script>
```

## CRITICAL: First-Time Setup Guide

### Step-by-Step Setup (Follow EXACTLY)

#### Step 1: Environment Verification
```bash
# Check Node.js version (must be 16+)
node --version
# If version is below 16, install Node.js 18+ from nodejs.org

# Check npm version (must be 8+)
npm --version
# If version is below 8, run: npm install -g npm@latest
```

#### Step 2: Create Project Structure
```bash
# Create project directory
mkdir vetvisits
cd vetvisits

# Initialize npm project
npm init -y
```

#### Step 3: Install Dependencies (EXACT ORDER)
```bash
# Install production dependencies
npm install express@^4.18.2 ejs@^3.1.9 govuk-frontend@^5.10.2 body-parser@^1.20.2 express-validator@^7.0.1

# Install development dependencies (NOTE: @axe-core/cli NOT axe-cli)
npm install --save-dev nodemon@^3.0.2 @axe-core/cli@^4.8.2 jest@^29.7.0
```

#### Step 4: Verify GOV.UK Frontend Installation
```bash
# Check if required files exist
ls node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css
ls node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js

# If files don't exist, reinstall govuk-frontend
npm uninstall govuk-frontend
npm install govuk-frontend@latest
```

#### Step 5: Update package.json Scripts
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "npm run test:accessibility && npm run test:unit",
    "test:accessibility": "@axe-core/cli http://localhost:3000",
    "test:unit": "jest"
  }
}
```

#### Step 6: Create app.js (EXACT MIDDLEWARE ORDER)
```javascript
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// CRITICAL ORDER - DO NOT CHANGE
// 1. Body parser FIRST
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Static files (public folder)
app.use(express.static('public'));

// 3. GOV.UK Frontend assets - EXACT PATH
app.use('/govuk-frontend', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist')));

// 4. Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes come after middleware
app.get('/', (req, res) => {
  res.render('index', { title: 'Test Page', errors: null, formData: {} });
});

app.listen(3000, () => {
  console.log('App running on http://localhost:3000');
});
```

#### Step 7: Create Basic Template Test
Create `views/index.ejs`:
```html
<!DOCTYPE html>
<html lang="en" class="govuk-template">
<head>
  <meta charset="utf-8">
  <title><%= title %> - GOV.UK</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="/govuk-frontend/govuk/govuk-frontend.min.css" rel="stylesheet">
</head>
<body class="govuk-template__body">
  <script>document.body.className = 'js-enabled' + ' ' + document.body.className;</script>
  
  <header class="govuk-header" role="banner" data-module="govuk-header">
    <div class="govuk-header__container govuk-width-container">
      <div class="govuk-header__logo">
        <a href="/" class="govuk-header__link govuk-header__link--homepage">
          <span class="govuk-header__logotype">
            <span class="govuk-header__logotype-text">GOV.UK</span>
          </span>
        </a>
      </div>
    </div>
  </header>

  <div class="govuk-width-container">
    <main class="govuk-main-wrapper" id="main-content" role="main">
      <h1 class="govuk-heading-xl"><%= title %></h1>
      <p class="govuk-body">If you can see this styled correctly, GOV.UK Frontend is working!</p>
    </main>
  </div>

  <script src="/govuk-frontend/govuk/govuk-frontend.min.js"></script>
  <script>window.GOVUKFrontend.initAll()</script>
</body>
</html>
```

#### Step 8: Test Setup
```bash
# Start the application
npm start

# Should see: "App running on http://localhost:3000"
# Open http://localhost:3000 in browser
# You should see:
# - Blue GOV.UK header
# - GOV.UK Transport font
# - Proper spacing and typography
# - No 404 errors in browser console
```

#### Step 9: Verification Checklist
- [ ] `npm start` runs without errors
- [ ] Page loads at http://localhost:3000
- [ ] Blue GOV.UK header visible
- [ ] Text uses GOV.UK Transport font (not default browser font)
- [ ] Browser console shows no 404 errors
- [ ] `window.GOVUKFrontend` object exists in browser console

### If Setup Fails

#### CSS/JS Not Loading (Plain HTML Look)
1. Stop server (Ctrl+C)
2. Check middleware order in app.js
3. Verify exact paths in template
4. Restart server: `npm start`
5. Hard refresh browser (Ctrl+F5)

#### 404 Errors for Assets
1. Check files exist: `ls node_modules/govuk-frontend/dist/govuk/`
2. Verify middleware path: `/govuk-frontend` route
3. Check template paths: `/govuk-frontend/govuk/govuk-frontend.min.css`

#### npm install Failures
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Check package.json for correct package names (`@axe-core/cli`)

### Emergency Troubleshooting Guide

#### Issue: `npm install` fails with package not found errors
**Immediate Fix**:
1. Check package.json for `@axe-core/cli` (NOT `axe-cli`)
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. If still failing, check Node.js/npm versions

#### Issue: Styles not loading (plain HTML appearance)
**Immediate Fix**:
1. Check browser console for 404 errors
2. Verify middleware order in app.js (body parser FIRST)
3. Confirm exact paths: `/govuk-frontend/govuk/govuk-frontend.min.css`
4. Restart server completely
5. Hard refresh browser (Ctrl+F5)

#### Issue: GOV.UK Frontend files not found
**Immediate Fix**:
```bash
# Verify files exist
ls node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css

# If missing, reinstall
npm uninstall govuk-frontend
npm install govuk-frontend@latest

# Re-verify files exist
ls node_modules/govuk-frontend/dist/govuk/
```

#### Issue: Components not interactive
**Immediate Fix**:
1. Check JavaScript console for errors
2. Verify `window.GOVUKFrontend.initAll()` is called
3. Ensure components have `data-module` attributes
4. Confirm JavaScript file loads correctly

### Success Validation Commands
After setup, ALL these commands must succeed:
```bash
# Check GOV.UK files exist
ls node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css
ls node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js

# Start server without errors
npm start

# Check for proper styling in browser
# Navigate to: http://localhost:3000
# Must see: Blue header, GOV.UK font, no console errors
```

**STOP AND FIX if any command fails before continuing development.**