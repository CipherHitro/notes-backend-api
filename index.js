const express = require('express');
const { connectMongoDB } = require('./connection')
require('dotenv').config()
const notesRoute = require('./routes/notes')

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Connect MongoDB
connectMongoDB(process.env.MONGOURL).then(() => console.log("Mongo Connected")).catch((err) => console.error(err))

// Routes 
app.use('/notes', notesRoute)

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(port, () => {
  console.log('Server is running at http://localhost:'+port);
});
