const express = require('express');

module.exports = () => {
  const app = express();
  app.listen = jest.fn();
  return app;
}