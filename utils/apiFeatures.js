class ApiFeatures {
        constructor(mongooseQuery, queryString) {
                this.mongooseQuery = mongooseQuery;
                this.queryString = queryString;
        }

        filter() {
                const queryStringObject = { ...this.queryString };
                const excludedFields = ['page', 'sort', 'limit', 'fields'];
                excludedFields.forEach(field => delete queryStringObject[field]);

                // Apply filters using [gte, lte, gt, lt] operators
                let queryStr = JSON.stringify(queryStringObject);
                queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

                // Build query
                this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
                return this;
        }

        sort() {
                if (this.queryString.sort) {
                        const sortBy = this.queryString.sort.split(',').join(' ');
                        this.mongooseQuery = this.mongooseQuery.sort(sortBy);
                } else {
                        this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
                }
                return this;
        }

        select() {
                if (this.queryString.fields) {
                        const fields = this.queryString.fields.split(',').join(' ');
                        this.mongooseQuery = this.mongooseQuery.select(fields);
                } else {
                        this.mongooseQuery = this.mongooseQuery.select('-__v');
                }
                return this;
        }

        search(modelName) {
                if (this.queryString.keyword) {
                        const keyword = this.queryString.keyword.toLowerCase();
                        if (modelName === 'product') {
                                this.mongooseQuery = this.mongooseQuery.find({
                                        $or: [
                                                { title: { $regex: keyword, $options: 'i' } },
                                                { description: { $regex: keyword, $options: 'i' } },
                                        ],
                                });
                        } else{
                                this.mongooseQuery = this.mongooseQuery.find({
                                        $or: [
                                                { name: { $regex: keyword, $options: 'i' } },
                                        ],
                                });
                        }
                }
                return this;
        }

        paginate(countDocuments) {
                const page = parseInt(this.queryString.page) || 1; // req.query.page * 1 || 1;
                const limit = parseInt(this.queryString.limit) || 50;
                const skip = page * limit - limit; //(page - 1) * limit;

                // Pagination results
                const pagination = {};
                pagination.currentPage = page;
                pagination.limit = limit;
                pagination.totalItems = countDocuments;
                pagination.totalPages = Math.ceil(countDocuments / limit);
                pagination.hasNextPage = pagination.totalPages > page;
                pagination.hasPreviousPage = page > 1;
                pagination.nextPage = pagination.hasNextPage ? page + 1 : null;
                pagination.previousPage = pagination.hasPreviousPage ? page - 1 : null;

                // Build query
                this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

                this.paginationResult = pagination;

                return this;
        }

        exec() {
                return this.mongooseQuery;
        }
}

export default ApiFeatures;