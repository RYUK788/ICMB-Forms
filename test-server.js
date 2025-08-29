import express from 'express';
const app = express();
const port = 3002;

app.get('/', (req, res) => {
  res.send('Test server is running!');
});

app.listen(port, () => {
  console.log(`Test server is alive on http://localhost:${port}`);
});