import express from 'express';
export const app = express();

app.get('/hello_world', (req, res) => {
  res.send('Hello World')
})

app.listen(3000);