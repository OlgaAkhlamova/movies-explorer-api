const router = require('express').Router();

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const {
  movieValidation, movieIdValidation,
} = require('../middlewares/validation');

router.get('/', getMovies);

router.post('/', movieValidation, createMovie);

router.delete('/:movieId', movieIdValidation, deleteMovie);

module.exports = router;
