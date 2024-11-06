const express = require ("express");
const router = express.Router();
const { addShoe, deleteShoe, getShoe, updateShoe } = require('../controllers/db');

router.post('/addShoe', addShoe),
router.get('/getShoe', getShoe),
router.delete('/deleteShoe/:id', deleteShoe),
router.put('/updateShoe/:id', updateShoe)


module.exports = router