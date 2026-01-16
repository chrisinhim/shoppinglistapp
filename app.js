require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shoppinglist')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/lists', require('./routes/shoppingList'));
app.use('/api/items', require('./routes/item'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// app.get('/user/:name', (req, res) => {
//     const userName = req.params.name; // Gets the name from the URL

//     // Instead of res.sendFile, we use res.render
//     // We pass an object containing the data we want to "inject"
//     res.render('profile', { 
//         username: userName, 
//         role: 'admin' 
//     });
// });

// app.get('/contact',(req,res)=>{
// res.sendFile(path.join(__dirname,'public','contact.html'))
// });

// app.get('/about', (req, res) => {
//     res.sendFile(path.join(__dirname,'public','about.html'))
// })


// 404 handler (should be last)
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));