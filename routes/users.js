const router = require('express').Router();
const { userValidation } = require('../middlewares/validation');

const {
  patchUser, getUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo);

router.patch('/me', userValidation, patchUser);

module.exports = router;
