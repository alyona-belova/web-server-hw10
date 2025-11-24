const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
  login: String,
  password: String
}, { collection: 'users' });

let User;

app.get('/login/', (req, res) => {
  res.send("27a51f8a-d703-492b-9fe6-b1d0e877d2ad");
});

app.post('/insert/', async (req, res) => {
  const { login, password, URL } = req.body;

  if (!login || !password || !URL) {
    return res.status(400).send("Missing parameters");
  }

  try {
    const conn = await mongoose.createConnection(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    User = conn.model("User", userSchema);

    const doc = new User({ login, password });
    await doc.save();

    res.send("Inserted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err.message);
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
