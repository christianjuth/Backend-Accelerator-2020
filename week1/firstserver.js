let express = require('express')
let app = express();

app.get('/hello_world', (req, res) => {
  res.send('Hello World')
});

app.listen(3000);

// Export app for testing
exports.app = app;