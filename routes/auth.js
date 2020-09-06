/*

    path: api/login

*/

const { Router } = require('express');
const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar_campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email').not().isEmpty().withMessage('El email es obligatorio').isEmail().withMessage('El email es inválido'),
    check('password').not().isEmpty().withMessage('El password es obligatorio').isLength({ 'min': 6 }).withMessage('El password debe contener por lo menos 6 caracteres'),
    validarCampos
], crearUsuario);

router.post('/', [
    check('email').not().isEmpty().withMessage('El email es obligatorio').isEmail().withMessage('El email es inválido'),
    check('password').not().isEmpty().withMessage('El password es obligatorio'),
    validarCampos
], login);

router.get('/renew', validarJWT, renewToken);

module.exports = router;