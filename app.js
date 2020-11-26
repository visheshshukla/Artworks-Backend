const express = require('express');
const bodyParser = require('body-parser');

const artsRoutes = require('./routes/arts-routes');

const app = express();

app.use(artsRoutes);

app.listen(5000);