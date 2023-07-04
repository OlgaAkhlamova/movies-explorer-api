const whitelist = [
  'http://localhost:3001',
  'http://localhost:6789',
  'http://localhost:9876',
  'http://gulogulo.movie.nomoredomains.sbs',
  'https://gulogulo.movie.nomoredomains.sbs',
];
const corsOptions = {
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,',
  optionsSuccessStatus: 204,
};
module.exports = (req, callback) => {
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions.origin = true; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions.origin = false; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
