const express = require('express');
const router = express.Router();
const statesData = require('../../model/statesData.json');
const State = require('../../model/State');

const verifyState = (stateParam) => {
    return statesData.find(s=> s.code === stateParam.toUpperCase());
};

// GET all states
router.get('/', async (req, res) => {
    let states = [...statesData];
    if (req.query.contig === 'true') {
        states = states.filter(s => s.code !== 'AK' && s.code !== 'HI');
    } else if (req.query.contig === 'false') {
        states = states.filter(s => s.code === 'AK' || s.code=== 'HI');
    }
    const mongoStates = await State.find();
    states = states.map(state => {
        const mongoState = mongoStates.find(ms => ms.stateCode === state.code);
        if (mongoState && mongoState.funfacts.length > 0) {
            return { ...state, funfacts: mongoState.funfacts };
        }
        return state;
    });
    res.json(states);
});

// GET specific state
router.get('/:state', async (req, res) => {
    const state = verifyState(req.params.state);
    if (!state) {
        return res.status(404).json({ message: `${req.params.state} is not a valid state abbreviation.` });
    }
    const mongoState = await State.findOne({ stateCode: state.code });
    const { funfacts, ...stateData } = state;
    if (mongoState && mongoState.funfacts.length > 0) {
        return res.json({ ...stateData, funfacts: mongoState.funfacts });
    }
    res.json(stateData);
});

// GET random fun fact
router.get('/:state/funfact', async (req, res) => {
    const state = verifyState(req.params.state);
    if (!state) {
        return res.status(404).json({ message: `${req.params.state} is not a valid state abbreviation.` });
    }
    const mongoState = await State.findOne({ stateCode: state.code });
    if (!mongoState || mongoState.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
    }
    const randomIndex = Math.floor(Math.random() * mongoState.funfacts.length);
    res.json({ funfact: mongoState.funfacts[randomIndex] });
});

// GET capital
router.get('/:state/capital', (req, res) => {
    const state = verifyState(req.params.state);
    if (!state) {
        return res.status(404).json({ message: `${req.params.state} is not a valid state abbreviation.` });
    }
    res.json({ state: state.state, capital: state.capital_city });
});

// GET nickname
router.get('/:state/nickname', (req, res) => {
    const state = verifyState(req.params.state);
    if (!state) {
        return res.status(404).json({ message: `${req.params.state} is not a valid state abbreviation.` });
    }
    res.json({ state: state.state, nickname: state.nickname });
});

// GET population
router.get('/:state/population', (req, res) => {
    const state = verifyState(req.params.state);
    if (!state) {
        return res.status(404).json({ message: `${req.params.state} is not a valid state abbreviation.` });
    }
    res.json({ state: state.state, population: state.population.toLocaleString('en-US') });
});

// GET admission date
router.get('/:state/admission', (req, res) => {
    const state = verifyState(req.params.state);
    if (!state) {
        return res.status(404).json({ message: `${req.params.state} is not a valid state abbreviation.` });
    }
    res.json({ state: state.state, admitted: state.admission_date });
});

// POST add fun facts
router.post('/:state/funfact', async (req, res) => {
    const state = verifyState(req.params.state);
    if (!state) {
        return res.status(404).json({ message: `${req.params.state} is not a valid state abbreviation.` });
    }
    const { funfacts } = req.body;
    if (!funfacts) {
        return res.status(400).json({ message: 'State fun facts value required' });
    }
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({ message: 'State fun facts value must be an array' });
    }
    let mongoState = await State.findOne({ stateCode: state.code });
    if (mongoState) {
        mongoState.funfacts = [...mongoState.funfacts, ...funfacts];
        const result = await mongoState.save();
        res.json(result);
    } else {
        const result = await State.create({ stateCode: state.code, funfacts });
        res.json(result);
    }
});

// PATCH update a fun fact
router.patch('/:state/funfact', async (req, res) => {
    const state = verifyState(req.params.state);
    if (!state) {
        return res.status(404).json({ message: `${req.params.state} is not a valid state abbreviation.` });
    }
    const { index, funfact } = req.body;
    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    if (!funfact) {
        return res.status(400).json({ message: 'State fun fact value required' });
    }
    const mongoState = await State.findOne({ stateCode: state.code });
    if (!mongoState || mongoState.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
    }
    if (index > mongoState.funfacts.length) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${state.state}` });
    }
    mongoState.funfacts[index - 1] = funfact;
    const result = await mongoState.save();
    res.json(result);
});

// DELETE a fun fact
router.delete('/:state/funfact', async (req, res) => {
    const state = verifyState(req.params.state);
    if (!state) {
        return res.status(404).json({ message: `${req.params.state} is not a valid state abbreviation.` });
    }
    const { index } = req.body;
    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    const mongoState = await State.findOne({ stateCode: state.code });
    if (!mongoState || mongoState.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
    }
    if (index > mongoState.funfacts.length) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${state.state}` });
    }
    mongoState.funfacts.splice(index - 1, 1);
    const result = await mongoState.save();
    res.json(result);
});

module.exports = router;