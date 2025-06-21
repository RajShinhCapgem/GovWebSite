const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configure Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});

// Set view engine
app.set('view engine', 'html');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files - Critical GOV.UK Frontend paths
app.use('/assets', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/assets')));
app.use('/govuk-frontend', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Animal species data with subcategories
const animalSpecies = {
    cattle: {
        name: 'Cattle',
        key: 'cattle',
        subcategories: ['Bulls', 'Cows', 'Heifers', 'Calves']
    },
    sheep: {
        name: 'Sheep',
        key: 'sheep',
        subcategories: ['Rams', 'Ewes', 'Lambs']
    },
    pigs: {
        name: 'Pigs',
        key: 'pigs',
        subcategories: ['Boars', 'Sows', 'Piglets']
    },
    poultry: {
        name: 'Poultry',
        key: 'poultry',
        subcategories: ['Chickens', 'Ducks', 'Geese', 'Turkeys']
    },
    horses: {
        name: 'Horses',
        key: 'horses',
        subcategories: ['Stallions', 'Mares', 'Geldings', 'Foals']
    }
};

// Routes
app.get('/', (req, res) => {
    res.render('start', {
        serviceName: 'Register animals for vet visits'
    });
});

app.get('/species-selection', (req, res) => {
    // Generate reference number server-side
    const referenceNumber = 'VV' + Date.now().toString().slice(-8);
    
    res.render('species-selection', {
        serviceName: 'Register animals for vet visits',
        pageTitle: 'What species of animals do you have?',
        species: animalSpecies,
        referenceNumber: referenceNumber,
        errors: req.query.errors ? JSON.parse(decodeURIComponent(req.query.errors)) : null
    });
});

app.post('/species-selection', (req, res) => {
    const selectedSpecies = req.body.species;
    const errors = {};
    
    if (!selectedSpecies || selectedSpecies.length === 0) {
        errors.species = {
            text: 'Select at least one species of animal'
        };
        
        const errorQuery = encodeURIComponent(JSON.stringify(errors));
        return res.redirect(`/species-selection?errors=${errorQuery}`);
    }
    
    // Store selected species in session (simplified for demo)
    const speciesNames = Array.isArray(selectedSpecies) ? selectedSpecies : [selectedSpecies];
    const queryParams = speciesNames.map(s => `species=${encodeURIComponent(s)}`).join('&');
    
    res.redirect(`/animal-counts?${queryParams}`);
});

app.get('/animal-counts', (req, res) => {
    const selectedSpeciesKeys = Array.isArray(req.query.species) ? req.query.species : [req.query.species];
    
    if (!selectedSpeciesKeys || selectedSpeciesKeys.length === 0) {
        return res.redirect('/species-selection');
    }
    
    const selectedSpecies = selectedSpeciesKeys
        .filter(key => animalSpecies[key])
        .map(key => animalSpecies[key]);
    
    if (selectedSpecies.length === 0) {
        return res.redirect('/species-selection');
    }
    
    res.render('animal-counts', {
        serviceName: 'Register animals for vet visits',
        pageTitle: 'How many animals do you have?',
        selectedSpecies: selectedSpecies,
        errors: req.query.errors ? JSON.parse(decodeURIComponent(req.query.errors)) : null,
        values: req.query.values ? JSON.parse(decodeURIComponent(req.query.values)) : {}
    });
});

app.post('/animal-counts', (req, res) => {
    const selectedSpeciesKeys = Array.isArray(req.query.species) ? req.query.species : [req.query.species];
    const errors = {};
    const values = {};
    let hasErrors = false;
    
    // Validate animal counts for each species and subcategory
    selectedSpeciesKeys.forEach(speciesKey => {
        const species = animalSpecies[speciesKey];
        if (!species) return;
        
        species.subcategories.forEach(subcategory => {
            // Create field name using same logic as template
            const fieldName = `${speciesKey}_${subcategory.toLowerCase().replace(/\s+/g, '_')}`;
            const count = req.body[fieldName];
            
            values[fieldName] = count || '';
            
            if (!count || count.trim() === '') {
                errors[fieldName] = {
                    text: `Enter the number of ${subcategory.toLowerCase()}`
                };
                hasErrors = true;
            } else if (isNaN(count) || parseInt(count) < 0) {
                errors[fieldName] = {
                    text: `Number of ${subcategory.toLowerCase()} must be 0 or more`
                };
                hasErrors = true;
            }
        });
    });
    
    if (hasErrors) {
        const errorQuery = encodeURIComponent(JSON.stringify(errors));
        const valuesQuery = encodeURIComponent(JSON.stringify(values));
        const speciesQuery = selectedSpeciesKeys.map(s => `species=${encodeURIComponent(s)}`).join('&');
        
        return res.redirect(`/animal-counts?${speciesQuery}&errors=${errorQuery}&values=${valuesQuery}`);
    }
    
    // Process successful submission
    const animalCounts = {};
    selectedSpeciesKeys.forEach(speciesKey => {
        const species = animalSpecies[speciesKey];
        if (!species) return;
        
        animalCounts[speciesKey] = {
            name: species.name,
            counts: {}
        };
        
        species.subcategories.forEach(subcategory => {
            const fieldName = `${speciesKey}_${subcategory.toLowerCase().replace(/\s+/g, '_')}`;
            animalCounts[speciesKey].counts[subcategory] = parseInt(req.body[fieldName]) || 0;
        });
    });
    
    // Generate registration reference
    const registrationRef = 'REG' + Date.now().toString().slice(-8);
    
    res.render('confirmation', {
        serviceName: 'Register animals for vet visits',
        pageTitle: 'Registration complete',
        animalCounts: animalCounts,
        registrationReference: registrationRef
    });
});

// Error handling
app.use((req, res) => {
    res.status(404).render('404', {
        serviceName: 'Register animals for vet visits',
        pageTitle: 'Page not found'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', {
        serviceName: 'Register animals for vet visits',
        pageTitle: 'Sorry, there is a problem with the service'
    });
});

app.listen(port, () => {
    console.log(`Vet visits application running on http://localhost:${port}`);
});
