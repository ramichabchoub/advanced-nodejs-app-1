import express from 'express';

import {
        signupValidator,
        loginValidator,
} from '../utils/validators/authValidator.js';

import {
        signup,
        login,
        forgotPassword,
} from '../services/authService.js';

const router = express.Router();

router.route('/signup').post(signupValidator, signup);
router.route('/login').post(loginValidator, login);
router.route('/reset-password').post(forgotPassword);
// router
//         .route('/:id')
//         .get(getUserValidator, getUser)
//         .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//         .delete(deleteUserValidator, deleteUser);

export default router;