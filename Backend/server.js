import app from './app.js';
import config from './config/env.js';
import { connectDB } from './config/db.js';

// Connect to DB first, then start the server
connectDB()

  .then(() => {
    const port = config.port || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  });