import multer from 'multer';
import ApiError from '../utils/apiError.js';

export const uploadSingleImage = (fieldName) => {
        const multerStorage = multer.memoryStorage();
        const multerFilter = (req, file, cb) => {
                if (file.mimetype.startsWith('image')) {
                        cb(null, true);
                } else {
                        cb(new ApiError('Not an image!', 400), false);
                }
        }
        const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
        return upload.single(fieldName);
}