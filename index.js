const express = require('express');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
const swaggerDocument = require('./Docs/swagger.json');
const authRoutes = require('./App/Routes/authRoutes');
const courseRoutes = require('./App/Routes/courseRoutes');
const userChapterModuleController = require('./App/Controllers/userChapterModuleController');
require('dotenv').config();

const port = process.env.PORT || process.env.HOSTPORT;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/v1', authRoutes);
app.use('/v1', courseRoutes);

app.use('/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.put('/v1/progress-course', userChapterModuleController.updateProgressChapter);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'successfully',
  });
});

app.put(
  '/v1/progress-course',
  userChapterModuleController.updateProgressChapter,
);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
