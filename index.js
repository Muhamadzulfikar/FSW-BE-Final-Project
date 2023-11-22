const express = require('express');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
const swaggerDocument = require('./Docs/swagger.json');
const authRoute = require('./App/Routes/Auth.routes');
require('dotenv').config();

const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/v1', authRoute);

app.use('/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('*', (req, res) => {
  res.status('200').json(
    {
      message: 'successfully',
    },
  );
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
