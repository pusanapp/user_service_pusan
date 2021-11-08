const express = require('express');
const router = express.Router();
const panelUserController = require('../controller/panel_user_controller')

router.post('/login', panelUserController.loginPanelUser)
router.post('/add', panelUserController.addNewUser)
router.put('/update', panelUserController.updateUser)
router.delete('/delete/:id', panelUserController.deleteUser)
router.get('/all', panelUserController.getAllPanelUser)

module.exports = router;
