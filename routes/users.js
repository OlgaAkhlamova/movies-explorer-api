const router = require('express').Router();
const { userValidation } = require('../middlewares/validation');

const {
  patchUser, getUserInfo,
} = require('../controllers/users');

router.get('/users/me', getUserInfo);

router.patch('/users/me', userValidation, patchUser);

module.exports = router;
