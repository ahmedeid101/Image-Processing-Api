import express, { Application, Request, Response } from 'express';
import router from './routes/router';

const app: Application = express();
const port = 3000;

// Set the routes
app.use('/', router);
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Connected',
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

export default app;
