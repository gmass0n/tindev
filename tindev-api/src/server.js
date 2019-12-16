const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const server = express();

// CONEXAO COM O BANCO DE DADOS
mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-9vnrx.mongodb.net/omnistack8?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

server.use(cors());
server.use(express.json());
server.use(routes);

server.listen(3333);
