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

// Static files - Critical GOV.UK Frontend asset paths
app.use('/assets', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/assets')));
app.use('/govuk-frontend', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Animal species data with subcategories
const animalSpecies = {
    cattle: {
        name: 'Cattle',
        key: 'cattle',
        subcategories: [
            { name: 'Dairy cows', key: 'dairy_cows' },
            { name: 'Beef cattle', key: 'beef_cattle' },
            { name: 'Bulls', key: 'bulls' },
            { name: 'Calves', key: 'calves' }
        ]
    },
    sheep: {
        name: 'Sheep',
        key: 'sheep',
        subcategories: [
            { name: 'Ewes', key: 'ewes' },
            { name: 'Rams', key: 'rams' },
            { name: 'Lambs', key: 'lambs' },
            { name: 'Wethers', key: 'wethers' }
        ]
    },
    pigs: {
        name: 'Pigs',
        key: 'pigs',
        subcategories: [
            { name: 'Sows', key: 'sows' },
            { name: 'Boars', key: 'boars' },
            { name: 'Piglets', key: 'piglets' },
            { name: 'Finishing pigs', key: 'finishing_pigs' }
        ]
    },
    poultry: {
        name: 'Poultry',
        key: 'poultry',
        subcategories: [
            { name: 'Laying hens', key: 'laying_hens' },
            { name: 'Broiler chickens', key: 'broiler_chickens' },
            { name: 'Ducks', key: 'ducks' },
            { name: 'Geese', key: 'geese' },
            { name: 'Turkeys', key: 'turkeys' }
        ]
    },
    horses: {
        name: 'Horses',
        key: 'horses',
        subcategories: [
            { name: 'Mares', key: 'mares' },
            { name: 'Stallions', key: 'stallions' },
            { name: 'Geldings', key: 'geldings' },
            { name: 'Foals', key: 'foals' }
        ]
    }
};

// Session data (in production, use proper session storage)
let sessionData = {};

// Generate a simple session ID
function generateSessionId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Routes
app.get('/', (req, res) => {
    const sessionId = generateSessionId();
    sessionData[sessionId] = { selectedSpecies: [], animalCounts: {} };
    
    res.render('start', {
        pageTitle: 'Register animals for vet visits',
        serviceName: 'Register animals for vet visits',
        sessionId: sessionId
    });
});

app.get('/species/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    
    if (!sessionData[sessionId]) {
        return res.redirect('/');
    }

    res.render('species-selection', {
        pageTitle: 'What type of animals do you have?',
        serviceName: 'Register animals for vet visits',
        sessionId: sessionId,
        species: animalSpecies,
        selectedSpecies: sessionData[sessionId].selectedSpecies || [],
        errors: req.query.errors ? JSON.parse(decodeURIComponent(req.query.errors)) : null
    });
});

app.post('/species/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const selectedSpecies = req.body.species || [];
    
    if (!sessionData[sessionId]) {
        return res.redirect('/');
    }

    // Validate selection
    const errors = {};
    if (!selectedSpecies.length) {
        errors.species = 'Select at least one type of animal';
    }

    if (Object.keys(errors).length > 0) {
        return res.redirect(`/species/${sessionId}?errors=${encodeURIComponent(JSON.stringify(errors))}`);
    }

    // Store selection
    sessionData[sessionId].selectedSpecies = Array.isArray(selectedSpecies) ? selectedSpecies : [selectedSpecies];
    
    res.redirect(`/animal-counts/${sessionId}`);
});

app.get('/animal-counts/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    
    if (!sessionData[sessionId] || !sessionData[sessionId].selectedSpecies.length) {
        return res.redirect('/');
    }

    const selectedSpeciesData = sessionData[sessionId].selectedSpecies.map(speciesKey => ({
        ...animalSpecies[speciesKey],
        subcategories: animalSpecies[speciesKey].subcategories.map(sub => ({
            ...sub,
            fieldName: `${speciesKey}_${sub.key}`,
            currentValue: sessionData[sessionId].animalCounts[`${speciesKey}_${sub.key}`] || ''
        }))
    }));

    res.render('animal-counts', {
        pageTitle: 'How many animals do you have?',
        serviceName: 'Register animals for vet visits',
        sessionId: sessionId,
        selectedSpecies: selectedSpeciesData,
        errors: req.query.errors ? JSON.parse(decodeURIComponent(req.query.errors)) : null
    });
});

app.post('/animal-counts/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    
    if (!sessionData[sessionId]) {
        return res.redirect('/');
    }

    const animalCounts = req.body;
    const errors = {};

    // Validate counts
    for (const [fieldName, count] of Object.entries(animalCounts)) {
        if (fieldName === 'sessionId') continue;
          if (!count || count.trim() === '') {
            errors[fieldName] = 'Enter the number of animals';
        } else if (!/^\d+$/.test(count.trim())) {
            errors[fieldName] = 'Number of animals must be a whole number';
        } else if (parseInt(count.trim()) < 0) {
            errors[fieldName] = 'Number of animals cannot be negative';
        } else if (parseInt(count.trim()) > 999999) {
            errors[fieldName] = 'Number of animals must be 999,999 or fewer';
        }
    }

    if (Object.keys(errors).length > 0) {
        return res.redirect(`/animal-counts/${sessionId}?errors=${encodeURIComponent(JSON.stringify(errors))}`);
    }

    // Store counts
    sessionData[sessionId].animalCounts = animalCounts;
    
    res.redirect(`/check-answers/${sessionId}`);
});

app.get('/check-answers/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    
    if (!sessionData[sessionId] || !sessionData[sessionId].selectedSpecies.length) {
        return res.redirect('/');
    }

    const data = sessionData[sessionId];
    const summaryData = [];

    data.selectedSpecies.forEach(speciesKey => {
        const species = animalSpecies[speciesKey];
        const speciesAnimals = [];
        
        species.subcategories.forEach(subcategory => {
            const fieldName = `${speciesKey}_${subcategory.key}`;
            const count = data.animalCounts[fieldName];
            
            if (count && parseInt(count) > 0) {
                speciesAnimals.push({
                    name: subcategory.name,
                    count: parseInt(count).toLocaleString()
                });
            }
        });

        if (speciesAnimals.length > 0) {
            summaryData.push({
                speciesName: species.name,
                animals: speciesAnimals
            });
        }
    });

    // Generate reference number
    const referenceNumber = 'VET' + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 5).toUpperCase();

    res.render('check-answers', {
        pageTitle: 'Check your answers',
        serviceName: 'Register animals for vet visits',
        sessionId: sessionId,
        summaryData: summaryData,
        referenceNumber: referenceNumber
    });
});

app.post('/check-answers/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    
    if (!sessionData[sessionId]) {
        return res.redirect('/');
    }

    // Generate reference number for confirmation
    const referenceNumber = 'VET' + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 5).toUpperCase();
    
    res.redirect(`/confirmation/${sessionId}/${referenceNumber}`);
});

app.get('/confirmation/:sessionId/:referenceNumber', (req, res) => {
    const { sessionId, referenceNumber } = req.params;
    
    if (!sessionData[sessionId]) {
        return res.redirect('/');
    }

    // Clean up session data after confirmation
    delete sessionData[sessionId];

    res.render('confirmation', {
        pageTitle: 'Registration complete',
        serviceName: 'Register animals for vet visits',
        referenceNumber: referenceNumber
    });
});

// Error handling
app.use((req, res) => {
    res.status(404).render('error', {
        pageTitle: 'Page not found',
        serviceName: 'Register animals for vet visits',
        errorCode: '404',
        errorMessage: 'Page not found'
    });
});

app.listen(port, () => {
    console.log(`Vet visits application running on http://localhost:${port}`);
});
