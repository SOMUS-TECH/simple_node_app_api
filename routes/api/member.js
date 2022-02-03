const express = require('express');
const router = express.Router();
const member = require('../../Members');

//get all members..
router.get('/', (req, res) => res.json(member));

//get single 
router.get('/:id', (req, res) => {
    const found = member.some(member => member.id === parseInt(req.params.id))
    if(found){
        res.json(member.filter(member => member.id === parseInt(req.params.id)))
    }else{
        res.status(400).json({
            msg: `Bad request member ${req.params.id} not found`
        })
    }
  
})

// Create a Member

router.post('/', (req, res) => {
    res.send(req.body);
})

module.exports = router;