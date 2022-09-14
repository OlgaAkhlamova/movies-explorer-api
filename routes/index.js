const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { authValidation, regValidation } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/notFoundError');
const pageNotFound = require('../utils/errorMessage');

router.post('/signin', authValidation, login);
router.post('/signup', regValidation, createUser);

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.use('/', (req, res, next) => {
  next(new NotFoundError(pageNotFound));
});
module.exports = router;
