# GOV.UK Design System - GitHub Copilot Instructions

## Core Principles
You are developing applications that MUST comply with the GOV.UK Design System (GDS). Always prioritize accessibility, usability, and government service standards.

## Framework & Version
- **Use GOV.UK Frontend v5.10.0+** (latest stable)
- **Package**: `govuk-frontend` from npm
- **Installation**: `npm install govuk-frontend`
- **Documentation**: https://design-system.service.gov.uk/

## Essential Requirements

### 1. Asset Path Configuration (Critical)
When setting up GOV.UK Frontend in Express.js applications:

**Static File Serving:**
```javascript
// Correct paths for govuk-frontend v5.10.0+
app.use('/assets', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/assets')));
app.use('/govuk-frontend', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk')));
```

**HTML Template References:**
```html
<link href="/govuk-frontend/govuk-frontend.min.css" rel="stylesheet">
<script src="/govuk-frontend/govuk-frontend.min.js"></script>
```

**Common Error:** Using `/assets/govuk-frontend.min.css` instead of `/govuk-frontend/govuk-frontend.min.css` - this breaks styling completely.

### 2. Accessibility Standards
- **MUST** meet WCAG 2.2 AA compliance
- Always include proper ARIA labels, roles, and descriptions
- Use semantic HTML5 elements
- Ensure proper heading hierarchy (h1 → h6)
- Include skip links for keyboard navigation
- Test with screen readers in mind

### 3. HTML Structure
```html
<!DOCTYPE html>
<html lang="en" class="govuk-template">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page Title - Service Name - GOV.UK</title>
  <link rel="stylesheet" href="govuk-frontend.min.css">
</head>
<body class="govuk-template__body">
  <!-- Use govuk-template__body wrapper -->
</body>
</html>
```

### 4. CSS Classes & Components
- **ALWAYS** use prefixed classes: `govuk-*`
- **NEVER** create custom styling that overrides GDS styles
- Use existing components before creating new ones
- Follow BEM methodology: `govuk-component__element--modifier`

### 5. Essential Components Usage

#### Page Layout
```html
<div class="govuk-width-container">
  <main class="govuk-main-wrapper" id="main-content" role="main">
    <!-- Content here -->
  </main>
</div>
```

#### Headings
```html
<h1 class="govuk-heading-xl">Service name</h1>
<h2 class="govuk-heading-l">Section heading</h2>
<h3 class="govuk-heading-m">Subsection heading</h3>
```

#### Forms (Critical for Gov Services)
```html
<div class="govuk-form-group">
  <label class="govuk-label" for="input-id">
    Label text
  </label>
  <input class="govuk-input" id="input-id" name="input-name" type="text">
</div>
```

#### Error Handling
```html
<div class="govuk-form-group govuk-form-group--error">
  <label class="govuk-label" for="input-id">Label</label>
  <p id="input-error" class="govuk-error-message">
    <span class="govuk-visually-hidden">Error:</span>
    Error message text
  </p>
  <input class="govuk-input govuk-input--error" id="input-id" 
         name="input-name" type="text" aria-describedby="input-error">
</div>
```

### 6. Key Components to Use
- **Buttons**: `govuk-button`, `govuk-button--secondary`
- **Links**: `govuk-link`, `govuk-back-link`
- **Tables**: `govuk-table`
- **Lists**: `govuk-list`, `govuk-list--bullet`
- **Panels**: `govuk-panel`, `govuk-inset-text`
- **Tags**: `govuk-tag` (updated in v5.0+)
- **Breadcrumbs**: `govuk-breadcrumbs`
- **Phase Banner**: `govuk-phase-banner`

### 7. JavaScript Integration
```javascript
import { initAll } from 'govuk-frontend'
initAll()
```

### 8. Form Patterns
- Always use fieldsets for grouped inputs
- Include hint text where helpful
- Progressive enhancement approach
- Validate on server-side primarily

### 9. Content Guidelines
- Use plain English (GOV.UK content style guide)
- Front-load important information
- Use active voice
- Sentence case for labels and headings
- No placeholder text in form fields

### 10. Common Patterns
- **Start pages** with prominent "Start now" button
- **Question pages** with single focused question
- **Check your answers** pattern for confirmation
- **Confirmation pages** after successful submission
- **Error summary** at top of pages with errors

### 11. Testing Requirements
- Test with keyboard navigation only
- Verify screen reader compatibility
- Check colour contrast ratios
- Test on mobile devices (responsive design)
- Validate HTML markup

### 12. Nunjucks Template Best Practices
- **String manipulation**: Use Nunjucks filters, not JavaScript methods
  - ✅ Correct: `{{ text | lower | replace(' ', '_') }}`
  - ❌ Wrong: `{{ text.lower().replace(' ', '_') }}`
- **Date/time generation**: Generate in Express routes, not templates
  - ✅ Correct: Pass `referenceNumber` from route to template
  - ❌ Wrong: `{{ "now" | date("format") }}` (filter doesn't exist)
- **Random numbers**: Generate in Express routes using `Math.random()`
- **Field name consistency**: Ensure JavaScript and template use same logic
  - Template: `species.key + '_' + (subcategory | lower | replace(' ', '_'))`
  - JavaScript: `${speciesKey}_${subcategory.toLowerCase().replace(/\s+/g, '_')}`

**CRITICAL: Nunjucks Filter Limitations**
- **NEVER** use advanced filters like `map`, `filter`, `reduce` - they're not available in standard Nunjucks
- **ALWAYS** use native Nunjucks constructs for data manipulation:
  - ✅ Correct: `{% for item in items %}{{ item.name }}{% if not loop.last %}, {% endif %}{% endfor %}`
  - ❌ Wrong: `{{ items | map(attribute='name') | join(', ') }}`
- **Available core filters**: `lower`, `upper`, `replace`, `join`, `length`, `default`, `safe`, `escape`
- **For complex data transformation**: Use loops with conditionals instead of filters
- **Testing**: Always test templates locally before deployment - filter errors break rendering

## Strict Rules
1. **NEVER** use Bootstrap, Material-UI, or other frameworks
2. **NEVER** override GDS component styles with custom CSS
3. **ALWAYS** use govuk-frontend JavaScript for interactive components
4. **ALWAYS** include proper error states and validation
5. **ALWAYS** test accessibility before considering complete
6. **ALWAYS** use semantic HTML elements appropriately
7. **NEVER** use advanced Nunjucks filters (map, filter, reduce) - use loops instead
8. **ALWAYS** verify Nunjucks filter availability before using in templates

## Code Quality Checks
- Validate HTML using W3C validator
- Check CSS for GDS compliance
- Ensure all interactive elements are keyboard accessible
- Verify all form elements have associated labels
- Test colour contrast meets AA standards

## Resources
- Design System: https://design-system.service.gov.uk/
- GitHub Repo: https://github.com/alphagov/govuk-frontend
- Service Manual: https://www.gov.uk/service-manual
- Content Guide: https://www.gov.uk/guidance/content-design

Remember: Government services must be accessible to all users. When in doubt, choose the more accessible option.