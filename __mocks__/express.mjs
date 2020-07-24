import express from 'express';

export default () => {
  const app = express();
  app.listen = jest.fn();
  return app;
}