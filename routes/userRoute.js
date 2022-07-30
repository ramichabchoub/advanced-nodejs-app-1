import express from 'express';

import {
        getUserValidator,
        createUserValidator,
        updateUserValidator,
        deleteUserValidator,
        changeUserPasswordValidator,
} from '../utils/validators/userValidator.js';

import {
        getUsers,
        getUser,
        createUser,
        updateUser,
        deleteUser,
        uploadUserImage,
        resizeImage,
        changeUserPassword,
} from '../services/userService.js';
import {
        protect,
        allowedTo
} from '../services/authService.js';

const router = express.Router();

router.put('/change-password/:id', changeUserPasswordValidator, changeUserPassword);

router
        .route('/')
        .get(protect, allowedTo('admin', 'manager'),getUsers)
        .post(protect, allowedTo('admin'),uploadUserImage, resizeImage, createUserValidator, createUser);
router
        .route('/:id')
        .get(protect, allowedTo('admin'),getUserValidator, getUser)
        .put(protect, allowedTo('admin'),uploadUserImage, resizeImage, updateUserValidator, updateUser)
        .delete(protect, allowedTo('admin'),deleteUserValidator, deleteUser);

export default router;