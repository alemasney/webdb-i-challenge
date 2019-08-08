const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/api/accounts', async (req, res) => {
    try {
        const accounts = await db.select('*').from('accounts')
        
        res.status(200).json(accounts)
    } catch (error) {
        res.status(500).json({ message: 'error getting posts', error: error});
    }
})

server.get('/api/accounts/:id', async (req, res) => {
    const {id} = req.params
    try {
        const [getById] = await db.select('*').from('accounts').where({id});

        if(getById) {
            res.status(200).json(getById);
        } else {
            res.status(404).json({message: `could not find ${id}`});
        }
    } catch (error) {
        res.status(500).json({message: `Invalid ${id}`, error: error });
    }
})

server.post('/api/accounts', async (req, res) => {
    const postBody = req.body;

    try {
        const NewAccount = await db.select('*').from('accounts').insert(postBody);

        res.status(201).json(NewAccount);
    } catch (error) {
        res.status(500).json({message: 'error adding account', error: error});
    }
})

server.put('/api/accounts/:id', async (req, res) => {
    const {id} = req.params;
    const updatedBody = req.body;

    try {
        const count = await db.select('*').from('accounts').where({id}).update(updatedBody);

        if (count) {
            res.status(201).json(count);
        } else {
            res.status(404).json({message: `could not update account #${id}`});
        }
    } catch (error) {
        res.status(500).json({message: 'Could not update post', error: error});
    }
})

server.delete('/api/accounts/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const deleted = await db.select('*').from('accounts').where({id}).del();

        if (deleted) {
            res.status(200).json({message: `Successfully deleted #${id}`});
        } else {
            res.status(404).json({message: `could not find account #${id}`});
        } 
    } catch (error) {
        res.status(500).json({message: 'account could not be deleted', error: error });
    }
})

module.exports = server;