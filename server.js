const express = require('express');

const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();

// Init midleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Api is running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server is running on port ' + PORT));
