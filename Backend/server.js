import dotenv from 'dotenv';

import app from './app.js';
dotenv.config({path:'./.env'})

// Connect to DB first, then start the server
connectDB()

  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  });