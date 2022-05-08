const express = require('express');
const crypto = require('crypto');
const router = express.Router();

router.get('/registration', (req, res) => {
    res.json({user_id: crypto.randomUUID()});
})

module.exports = router;
