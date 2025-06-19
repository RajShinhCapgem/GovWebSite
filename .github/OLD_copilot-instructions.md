
When chaining commands, always use; instead of && to ensure each command runs independently.

You are assisting in building web applications that fully comply with the UK Government Design System, as defined at:
👉 https://frontend.design-system.service.gov.uk/

You must follow these detailed guidelines at all times when generating code:

🏛️ Design System Compliance
Use only official components and patterns from GOV.UK Frontend Design System.
Apply correct govuk- CSS class names for all HTML elements.
Components must match GOV.UK Design System structure, markup, and accessibility guidelines.
🎨 Styling and Layout
Use the govuk-frontend npm package as the primary source of styles and components.
Never use custom CSS unless explicitly requested.
Avoid third-party frameworks like Bootstrap, Tailwind, Material UI, or custom design tokens.
Ensure visual consistency with GOV.UK colors, spacing, typography, and layouts.
🖥️ HTML & Accessibility
All HTML must be semantic and accessible.
Use proper heading structure (<h1> to <h6>) for page hierarchy.
All form elements must include visible label elements, aria-describedby where applicable, and correct error message placement.
Follow WCAG 2.1 AA accessibility standards by default.
Apply proper role, aria- attributes, and keyboard accessibility support.
🧩 Component Usage Examples
Text input example:

<div class="govuk-form-group">
  <label class="govuk-label" for="email">Email address</label>
  <input class="govuk-input" id="email" name="email" type="email">
</div>
Button example:

<button class="govuk-button" data-module="govuk-button">
  Save and continue
</button>
Error message example:

<div class="govuk-form-group govuk-form-group--error">
  <label class="govuk-label" for="email">Email address</label>
  <span id="email-error" class="govuk-error-message">
    <span class="govuk-visually-hidden">Error:</span> Enter a valid email address
  </span>
  <input class="govuk-input govuk-input--error" id="email" name="email" type="email" aria-describedby="email-error">
</div>
Radio button example:

<div class="govuk-form-group">
  <fieldset class="govuk-fieldset" role="group" aria-describedby="example-hint">
    <legend class="govuk-fieldset__legend">Do you agree?</legend>
    <div class="govuk-radios">
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="yes" name="agreement" type="radio" value="yes">
        <label class="govuk-label govuk-radios__label" for="yes">Yes</label>
      </div>
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="no" name="agreement" type="radio" value="no">
        <label class="govuk-label govuk-radios__label" for="no">No</label>
      </div>
    </div>
  </fieldset>
</div>
⚙ Technical Assumptions
The govuk-frontend package is installed via npm install govuk-frontend.
JavaScript initialization uses:
import { initAll } from 'govuk-frontend';
initAll();
Use progressive enhancement where possible.
Server-side rendering preferred when possible for better accessibility.
🚫 Prohibited Patterns
Do not use inline styles.
Do not use non-GOV.UK class names unless explicitly allowed.
Do not generate custom UI components outside the GOV.UK Design System without explicit instruction.
Do not add new third-party frontend libraries unless requested.
📖 Documentation References
GOV.UK Frontend Components: https://frontend.design-system.service.gov.uk/components/
GOV.UK Patterns: https://design-system.service.gov.uk/patterns/
GOV.UK Accessibility Guidance: https://www.gov.uk/service-manual/helping-people-to-use-your-service/accessibility
Always prioritize: GOV.UK standards → accessibility → semantic HTML → simplicity.