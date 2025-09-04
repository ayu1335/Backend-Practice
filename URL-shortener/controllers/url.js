const {nanoid} = require('nanoid');
const URL = require('../models/url');

async function createShortURL(req, res){
    const body = req.body;
    if(!body.redirectURL){
        return res.status(400).json({message: "redirectURL is required"});
    }
    const shortID = nanoid(8);
    await URL.create({shortID:shortID, redirectURL: body.redirectURL, visitHistory: []});
    return res.status(201).json({shortID: shortID});

};

module.exports = {createShortURL}; 