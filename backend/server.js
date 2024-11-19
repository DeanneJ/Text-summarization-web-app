const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

const userRoutes = require('./routes/userRoutes.js');
const summarizeRoutes = require('./routes/summarizeRoutes.js');
const summaryRoutes = require('./routes/summaryRoutes.js');
const feedbackRoutes = require('./routes/feedbackRoutes.js');

const port = process.env.PORT || 5000;
connectDB();

const cors = require('cors');
const app = express();


// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your client-side URL
  credentials: true, // Allow cookies to be sent with the request
}));


//
app.use('/api/users', userRoutes);
// app.use('/api/summarize', summarizeRoutes);
app.use('/api/summaries', summaryRoutes);
app.use('/api/feedbacks', feedbackRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.render('index'); // Render index.ejs
  });
}

//Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
