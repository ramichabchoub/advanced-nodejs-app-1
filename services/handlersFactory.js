import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';
import ApiFeatures from '../utils/apiFeatures.js';

export const deleteOne = (Model) =>
        asyncHandler(async (req, res, next) => {
                const doc = await Model.findByIdAndDelete(req.params.id);
                if (!doc) {
                        return next(new ApiError('Not found', 404));
                }
                res.status(204).json({ success: true, data: null });
        });

export const updateOne = (Model) =>
        asyncHandler(async (req, res, next) => {
                const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                if (!doc) {
                        return next(new ApiError('Not found', 404));
                }
                res.status(200).json({ success: true, data: doc });
        });

export const createOne = (Model) =>
        asyncHandler(async (req, res, next) => {
                const doc = await Model.create(req.body);
                res.status(201).json({ success: true, data: doc });
        }
        );

export const getOne = (Model) =>
        asyncHandler(async (req, res, next) => {
                const doc = await Model.findById(req.params.id);
                if (!doc) {
                        return next(new ApiError('Not found', 404));
                }
                res.status(200).json({ success: true, data: doc });
        }
        );

export const getAll = (Model,modelName='') =>
        asyncHandler(async (req, res) => {
                let filter = {};
                if (req.filterObject) {
                        filter = req.filterObject;
                }
                const countDocuments = await Model.countDocuments();
                const features = new ApiFeatures(Model.find(filter), req.query);
                features.filter().sort().search(modelName).paginate(countDocuments).select();
                const { mongooseQuery, paginationResult } = features;
                const docs = await mongooseQuery;
                res.status(200).json({
                        success: true,
                        count: docs.length,
                        paginationResult,
                        data: docs,
                });
        });