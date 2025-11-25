const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const USER_LOGIN = '27a51f8a-d703-492b-9fe6-b1d0e877d2ad';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/login/', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(USER_LOGIN);
});

app.post('/insert/', async (req, res) => {
  try {
    const { login, password, URL } = req.body;

    if (!login || !password || !URL) {
      return res.status(400).json({
        error: 'Необходимы параметры: login, password и URL'
      });
    }

    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

    const userSchema = new mongoose.Schema({
      login: String,
      password: String
    });

    const User = mongoose.model('User', userSchema, 'users');

    const newUser = new User({
      login: login,
      password: password
    });

    await newUser.save();

    await mongoose.connection.close();

    res.json({
      success: true,
      message: 'Пользователь успешно добавлен в базу данных',
      data: {
        login: login,
        password: '***'
      }
    });

  } catch (error) {
    console.error('Ошибка при добавлении пользователя:', error);
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }

    res.status(500).json({
      success: false,
      error: 'Ошибка при добавлении пользователя в базу данных',
      details: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'Приложение работает корректно',
    routes: {
      '/login/': 'GET - возвращает ваш логин',
      '/insert/': 'POST - добавляет пользователя в MongoDB'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Маршрут не найден'
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Ваш логин: ${USER_LOGIN}`);
});
