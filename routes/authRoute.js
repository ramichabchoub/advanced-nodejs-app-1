import express from 'express';

import {
        signupValidator,
        loginValidator,
        forgotPasswordValidator,
        verifyResetCodeValidator,
        resetPasswordValidator,
} from '../utils/validators/authValidator.js';

import {
        signup,
        login,
        forgotPassword,
        verifyResetCode,
        resetPassword,
} from '../services/authService.js';

const router = express.Router();

router.route('/signup').post(signupValidator, signup);
router.route('/login').post(loginValidator, login);
router.route('/reset-password').post(forgotPasswordValidator,forgotPassword);
router.route('/verify-reset-code').post(verifyResetCodeValidator,verifyResetCode);
router.route('/reset-password').put(resetPasswordValidator,resetPassword);
// router
//         .route('/:id')
//         .get(getUserValidator, getUser)
//         .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//         .delete(deleteUserValidator, deleteUser);

export default router;