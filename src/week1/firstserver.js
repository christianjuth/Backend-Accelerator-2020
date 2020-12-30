let express = require('express')
let app = express();
const config = require('../../config');

app.get('/hello_world', (req, res) => {
  res.send('Hello World')
});

app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`)
});

// Export app for testing
exports.app = app;