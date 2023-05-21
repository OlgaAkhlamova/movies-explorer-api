require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
// const { CORS } = require('./middlewares/CORS');
const cors = require('cors');
const { errorLogger } = require('./middlewares/logger');
// const { requestLogger} = require('./middlewares/logger');
const routes = require('./routes/index');
const mainErrorHandler = require('./middlewares/mainErrorHandler');
const apiRequestLimiter = require('./middlewares/apiRequestLimiter');

const { PORT = 3700, DB_ADRESS = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();

app.use(helmet());
// app.use(requestLogger); // подключаем логгер запросов
app.use(apiRequestLimiter); // устанавливаем ограничение на запросы
// app.use(CORS);
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_ADRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('connected'))
  .catch((err) => console.log(`Ошибка ${err.name}: ${err.message}`));

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.use(routes); // подключаем роутинг

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(mainErrorHandler); // централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
