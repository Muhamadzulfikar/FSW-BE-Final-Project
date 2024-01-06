const express = require('express');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
const { default: helmet } = require('helmet');

const swaggerDocument = require('./Docs/swagger.json');
const authRoutes = require('./App/Routes/authRoutes');
const courseRoutes = require('./App/Routes/courseRoutes');
require('dotenv').config();

const port = process.env.PORT || process.env.HOSTPORT;
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.disable('x-powered-by');

app.use('/v1', authRoutes);
app.use('/v1', courseRoutes);

app.use('/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'successfully',
  });
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
