# Prompt 1 - Create Site

Create a single-page Node.js Express app using GOV.UK Design System named vetvisits inside the current folder for farmers to register animals for vet visits, with a page for selecting the species the farmer has, and on the next page adding the animal count based on the sub categories of that species (e.g., ewes).

This application MUST follow the GOV.UK Design System standards to ensure consistency with government services. All code should use the official GOV.UK Frontend components, styles, and patterns.

IMPORTANT: Strictly follow the copilot-instructions.md file, especially the Nunjucks template best practices section regarding filter syntax vs JavaScript methods.

Use Context7 constantly (govuk-design-system, nunjucks etc) to ensure you get the correct libraries, styles, codes, and learnings.

# Prompt 2 - Generate basket from image

I want a page linked from VetVisits home page that creates a basket page represented by the basket.jpg, implement it using the GOV.UK design system. Follow the products on the image exactly for the basket, i.e., tomatoe, 1lb

# Prompt 3 - Create API and connect web app

Move all the hardcoded products, vet visits functionality to an API named vetvisits-api (the values can be harded there) and integrate it with the vet visits app

For the API, Add swagger open/api documentation so can see the endpoints and test them interactively.

//API Docs will appear at http://localhost:3001/api-docs/

# Prompt 4 - Create Startup scripts

Create startup script to launch api and then the website, the entire app should be launched via npm run dev