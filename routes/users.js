const express = require('express');
const { registerUser, loginUser, getUsers, deleteUser, updateUser, sendResetLink } = require('../controllers/users');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);
router.post('/reset-password', sendResetLink);

module.exports = router;

