// Router/routes.js
const express = require('express');
const methods = require('../Controllers/methods');
const { verifyLogin, verifyLogintoken } = require('../Validator/Validation');

const router = express.Router();

router.get('/getAll', methods.getAll);
router.post('/dataCreation', methods.dataCreation);
router.delete('/oneDataDelete/:_id', methods.oneDataDelete);
router.get('/findOneStudent/:_id', methods.findOneStudent);
router.put('/updateOneStudentData/:_id', methods.updateOneStudentData);
router.post('/Login', methods.Login);
router.post('/verifyLogin', verifyLogintoken, methods.verifyLogin);
router.post('/addMarks/:_id', methods.addMarks);
router.get('/findMarks/:id', methods.findMarks);
router.delete('/deleteMarks/:id', methods.deleteMarks);
router.post('/agenda', methods.agendaFunction);
router.get('/getAllPagination', methods.getAllPagination);
// router.get('/getAllSearch', methods.getAllSearch);



module.exports = router;
