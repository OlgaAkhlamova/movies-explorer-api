const router = require('express').Router();

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const {
  movieValidation, movieIdValidation,
} = require('../middlewares/validation');

router.get('/movies', getMovies);

router.post('/movies', movieValidation, createMovie);

router.delete('/movies/:movieId', movieIdValidation, deleteMovie);

module.exports = router;
