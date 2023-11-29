const express = require('express');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
const swaggerDocument = require('./Docs/swagger.json');
// const authRoute = require('./App/Routes/authRoutes');
const courseRoute = require('./App/Routes/courseRoutes');
const userChapterModuleController = require('./App/Controllers/userChapterModuleController');
const courseController = require('./App/Controllers/courseController');
require('dotenv').config();

const port = process.env.PORT || process.env.HOSTPORT;
const app = express();

app.use(express.json());
app.use(cors());

// app.use('/v1', authRoute);
app.use('/v1', courseRoute);

app.use('/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'successfully',
  });
});

app.get('/courses', courseController.filterCourse);

app.put(
  '/v1/progress-course',
  userChapterModuleController.updateProgressChapter,
);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
