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

const router = express.Router();

router.put('/change-password/:id', changeUserPasswordValidator, changeUserPassword);

router
        .route('/')
        .get(getUsers)
        .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
        .route('/:id')
        .get(getUserValidator, getUser)
        .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
        .delete(deleteUserValidator, deleteUser);

export default router;