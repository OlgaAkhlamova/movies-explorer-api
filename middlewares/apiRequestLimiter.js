const rateLimit = require('express-rate-limit');
const ManyRequestError = require('../errors/manyRequests');
const { manyRequest } = require('../utils/errorMessage');

module.exports = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  handler: (req, res, next) => next(new ManyRequestError(manyRequest)),
});
